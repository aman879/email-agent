// Package woeker manages the background loops and email dispatch logic
package worker

import (
	"fmt"
	"log"
	"time"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/mail"
	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/jinzhu/now"
)

type Engine struct {
	Store *db.Store
}

// StartRunning language the 24/7 background loops
func (e *Engine) StartRunning() {
	log.Println("Background AI worker started...")

	ticker := time.NewTicker(1 * time.Minute)

	for range ticker.C {
		e.ProcessPendingLeads()
	}
}

// ProcessPendingLeads finds leads ready for thier next email ste
func (e *Engine) ProcessPendingLeads() {
	var leads []models.Lead
	now := time.Now()

	e.Store.DB.Where(("status In ? AND next_Action_at <= ?"), []string{"pending", "waiting"}, now).Find(&leads)

	for _, lead := range leads {
		log.Printf("Worker: Processing lead %s for step %d", lead.Email, lead.CurrentStep)
		var step models.WorkFlowStep

		err := e.Store.DB.Preload("Templates").Where("campaign_id = ? AND step_order = ?", lead.CampaignID, lead.CurrentStep).First(&step).Error
		if err != nil {
			log.Printf("Skipping lead %s: %v", lead.Email, err)
			continue
		}

		combinedTemplate := ""
		if len(step.Templates) > 0 {
			combinedTemplate = step.Templates[0].Body
		}

		if combinedTemplate == "" {
			log.Printf("Skipping lead %s: no template found for step %d", lead.Email, lead.CurrentStep)
			continue
		}

		rawSubject, rawBody, err := mail.ParseTemplate(combinedTemplate)
		if err != nil {
			log.Printf("Template error for campaign %d: %v", lead.CampaignID, err)
			continue
		}

		sender, err := mail.GetAvialbleSender(e.Store, lead.CampaignID)
		if err != nil {
			log.Printf("Skipping lead %s: %v", lead.Email, err)
			continue
		}

		leadData := lead.GetMap()
		finalSubject, _ := mail.RenderTemplate(rawSubject, leadData)
		finalBody, _ := mail.RenderTemplate(rawBody, leadData)

		// Handle legacy fallback
		smtpUser := sender.SMTPUser
		if smtpUser == "" {
			smtpUser = sender.Email
		}
		smtpPass := sender.SMTPPassword
		if smtpPass == "" {
			smtpPass = sender.Password
		}

		emailReq := mail.EmailRequest{
			From:         sender.Email,
			To:           lead.Email,
			Subject:      finalSubject,
			Body:         finalBody,
			SMTPUser:     smtpUser,
			SMTPPassword: smtpPass,
			Host:         sender.SMTPHost,
			Port:         sender.SMTPPort,
		}

		err = mail.SendRawEmail(emailReq)
		if err != nil {
			log.Printf("Failed to send mail to %s: %v", lead.Email, err)
			e.Store.DB.Model(&lead).Update("status", "failed")
			
			// Log activity error
			e.Store.DB.Create(&models.ActivityLog{
				CampaignID: lead.CampaignID,
				Type:       "error",
				Message:    fmt.Sprintf("Failed to send to %s: %v", lead.Email, err),
			})
			continue
		}

		e.Store.DB.Model(&lead).Updates(map[string]interface{}{
			"status":      "sent",
			"last_msg_id": "tracked",
			"sent_at":     time.Now(),
		})

		e.Store.DB.Model(sender).Updates(map[string]interface{}{
			"sent_count":   sender.SentCount + 1,
			"last_used_at": time.Now(),
		})

		// Log activity
		e.Store.DB.Create(&models.ActivityLog{
			CampaignID: lead.CampaignID,
			Type:       "success",
			Message:    "Sent email to " + lead.Email,
		})

		log.Printf("Successfully sent email to %s using %s", lead.Email, sender.Email)
	}
}

// ResetDailyCounters zeroes out the SentCount for all account every midnight.
func (e *Engine) ResetDailyCounters() {
	e.Store.DB.Model(&models.SenderAccount{}).
		Where("last_used_at < ?", now.BeginningOfDay()).
		Update("sent_count", 0)
}
