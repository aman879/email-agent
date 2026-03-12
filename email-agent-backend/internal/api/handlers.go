// Package api handles the HTTP request-response logic/
package api

import (
	"net/http"
	"strconv"

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
	campsignID, err := strconv.ParseUint(campaignIDStr, 10, 32)
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
	if err := csvSvc.ProcessLeadCSV(uint(campsignID), src); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to process leads"})
	}

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

	return c.JSON(http.StatusCreated, cp)
}

// AddWorkFlowStep saves a template (Subject + Body) to a specific campaign
// The template should follow the "Subject: ... --- Body: ..." format
func (h *Handler) AddWorkFlowStep(c echo.Context) error {
	step := new(models.WorkFlowStep)
	if err := c.Bind(step); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid step data"})
	}

	if err := h.Store.DB.Create(&step).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not save workflow step"})
	}

	return c.JSON(http.StatusCreated, step)
}

// AddSenderAccount saves SMTP/IMAP credentials
func (h *Handler) AddSenderAccount(c echo.Context) error {
	account := new(models.SenderAccount)
	if err := c.Bind(account); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid account credentials"})
	}

	if err := h.Store.DB.Create(&account).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error":"Could not save sender account"})
	}

	return c.JSON(http.StatusCreated, account)
}

// LinkSenderToCampaign connects an email account to a campaign for rotation
func (h *Handler) LinkSenderToCampaign(c echo.Context) error {
	link := new(models.Campaign)
	if err := c.Bind(link); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid mapping data"})
	}

	if err := h.Store.DB.Create(&link).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not link account to campaign"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Account linked Successfully"})
}
