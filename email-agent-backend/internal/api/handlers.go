// Package api handles the HTTP request-response logic/
package api

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/aman879/email-agent-backend/internal/services"
	"github.com/labstack/echo/v4"
)

// Handler contains the dependencies for our API endpoints.
type Handler struct {
	Store *db.Store
}

// HealthCheck returns the status of the server.
func (h *Handler) HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status":  "online",
		"message": "AI Agent is monitoring emails 24/7",
	})
}

// UploadCSV handles the mutlipart file upload from the dashboard
func (h *Handler) UploadCSV(c echo.Context) error {
	campaignIDStr := c.FormValue("campaign_id")
	campaignID, err := strconv.ParseUint(campaignIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid Campaign ID"})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "No file uploaded"})
	}

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	csvSvc := services.CSVService{Store: h.Store}
	if err := csvSvc.ProcessLeadCSV(uint(campaignID), src); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to process leads"})
	}

	// Log activity
	h.Store.DB.Create(&models.ActivityLog{
		CampaignID: uint(campaignID),
		Type:       "success",
		Message:    "Imported leads from CSV",
	})

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Successfully imported leads and mapped dynamic columns",
	})
}

// CreateCampaign saves a new campaign name to the database
func (h *Handler) CreateCampaign(c echo.Context) error {
	cp := new(models.Campaign)
	if err := c.Bind(cp); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	if err := h.Store.DB.Create(&cp).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not create campaign"})
	}

	// Log activity
	h.Store.DB.Create(&models.ActivityLog{
		CampaignID: cp.ID,
		Type:       "success",
		Message:    "Created new campaign: " + cp.Name,
	})

	return c.JSON(http.StatusCreated, cp)
}

// ListCampaigns returns all campaigns with their steps and leads
func (h *Handler) ListCampaigns(c echo.Context) error {
	var campaigns []models.Campaign
	if err := h.Store.DB.Preload("Steps.Templates").Preload("Leads").Find(&campaigns).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not fetch campaigns"})
	}
	return c.JSON(http.StatusOK, campaigns)
}

// AddWorkFlowStep saves a template (Subject + Body) to a specific campaign
// The template should follow the "Subject: ... --- Body: ..." format
func (h *Handler) AddWorkFlowStep(c echo.Context) error {
	step := new(models.WorkFlowStep)
	if err := c.Bind(step); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid step data"})
	}

	if step.Template != "" {
		step.Templates = []models.Template{
			{Body: step.Template},
		}
	}

	if err := h.Store.DB.Create(&step).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not save workflow step"})
	}

	// Log activity
	h.Store.DB.Create(&models.ActivityLog{
		CampaignID: step.CampaignID,
		Type:       "info",
		Message:    "Added new workflow step",
	})

	return c.JSON(http.StatusCreated, step)
}

// AddSenderAccount saves SMTP/IMAP credentials
func (h *Handler) AddSenderAccount(c echo.Context) error {
	account := new(models.SenderAccount)
	if err := c.Bind(account); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid account credentials"})
	}

	if err := h.Store.DB.Create(&account).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not save sender account"})
	}

	return c.JSON(http.StatusCreated, account)
}

// ListSenders returns all sender accounts
func (h *Handler) ListSenders(c echo.Context) error {
	var accounts []models.SenderAccount
	if err := h.Store.DB.Find(&accounts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not fetch sender accounts"})
	}

	// Scrub passwords before returning
	for i := range accounts {
		accounts[i].SMTPPassword = ""
		accounts[i].IMAPPassword = ""
		accounts[i].Password = ""
	}

	return c.JSON(http.StatusOK, accounts)
}

// DeleteSenderAccount removes an email account and its links
func (h *Handler) DeleteSenderAccount(c echo.Context) error {
	id := c.Param("id")
	
	// Delete links first (implicit in some DBs but safer to be explicit)
	h.Store.DB.Where("sender_id = ?", id).Delete(&models.CampaignSender{})
	
	if err := h.Store.DB.Delete(&models.SenderAccount{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not delete sender account"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Account deleted successfully"})
}

// LinkSenderToCampaign connects an email account to a campaign for rotation
func (h *Handler) LinkSenderToCampaign(c echo.Context) error {
	link := new(models.CampaignSender)
	if err := c.Bind(link); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid mapping data"})
	}

	// Use FirstOrCreate to avoid "UNIQUE constraint failed" if the link already exists
	if err := h.Store.DB.FirstOrCreate(&link, models.CampaignSender{
		CampaignID: link.CampaignID,
		SenderID:   link.SenderID,
	}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not link account to campaign"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Account linked Successfully"})
}

// GetStats calculates real-time dashboard metrics
func (h *Handler) GetStats(c echo.Context) error {
	var totalLeads int64
	h.Store.DB.Model(&models.Lead{}).Count(&totalLeads)

	var totalSent int64
	h.Store.DB.Model(&models.SenderAccount{}).Select("COALESCE(SUM(sent_count), 0)").Scan(&totalSent)

	var totalReplied int64
	h.Store.DB.Model(&models.Lead{}).Where("status = ?", "replied").Count(&totalReplied)

	// Fetch last 15 days of chart data
	chartData := make([]struct {
		Date  string `json:"date"`
		Count int    `json:"count"`
	}, 0)
	h.Store.DB.Raw(`
		SELECT date(sent_at) as date, count(*) as count 
		FROM leads 
		WHERE sent_at > ? 
		GROUP BY date(sent_at) 
		ORDER BY date(sent_at) ASC`,
		time.Now().AddDate(0, 0, -15)).Scan(&chartData)

	// Fetch recent activity logs
	recentLogs := make([]models.ActivityLog, 0)
	h.Store.DB.Order("created_at desc").Limit(10).Find(&recentLogs)

	var conversionRate float64
	if totalLeads > 0 {
		conversionRate = (float64(totalReplied) / float64(totalLeads)) * 100
	}

	if chartData == nil {
		chartData = make([]struct {
			Date  string `json:"date"`
			Count int    `json:"count"`
		}, 0)
	}
	if recentLogs == nil {
		recentLogs = make([]models.ActivityLog, 0)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"total_leads":     totalLeads,
		"total_sent":      totalSent,
		"total_replied":   totalReplied,
		"conversion_rate": fmt.Sprintf("%.1f%%", conversionRate),
		"chart_data":      chartData,
		"recent_logs":     recentLogs,
	})
}
