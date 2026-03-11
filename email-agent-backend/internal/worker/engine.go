// Package woeker manages the background loops and email dispatch logic
package worker

import (
	"bytes"
	"html/template"
	"log"
	"time"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
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

// ProcessPendingLeads finds leads ready for thier next email step
func (e *Engine) ProcessPendingLeads() {
	var leads []models.Lead
	now := time.Now()

	e.Store.DB.Where(("status In ? AND next_Action_at <= ?"), []string{"pending", "waiting"}, now).Find(&leads)

	for _, lead := range leads {
		log.Printf("Worker: Processing lead %s for step %d", lead.Email, lead.CurrentStep)

		e.Store.DB.Model(&lead).Update("status", "sent")
	}
}

// RenderTemplate takes an email body with {{.ColumnName}} and replaces it with Lead data.
func (e *Engine) RenderTemplate(rawTemplate string, lead *models.Lead) (string, error) {
	data := lead.GetMap()

	tmpl, err := template.New("email").Parse(rawTemplate)
	if err != nil {
		return "", err
	}

	var tpl bytes.Buffer
	if err := tmpl.Execute(&tpl, data); err != nil {
		return "", err
	}

	return tpl.String(), nil
}
