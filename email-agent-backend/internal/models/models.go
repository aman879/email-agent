// Package models defines the database schema and JSON structures
package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// Campaign represents a group of leads and a sequence of email steps
type Campaign struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Status    string         `gorm:"default:'paused'" json:"status"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Steps     []WorkFlowStep `json:"steps"`
	Leads     []Lead         `json:"leads"`
}

// WorkFlowStep defines what the AI should do and when.
type WorkFlowStep struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	CampaignID uint   `json:"campaign_id"`
	StepOrder  int    `json:"step_order"`  // 1, 2, 3...
	ActionType string `json:"action_type"` // SEND_EMAIL, WAIT
	DelayHours int    `json:"delay_hours"` // Used if ActionType is WAIT
	Template   string `gorm:"type:text" json:"template"`
}

// Lead represents a recipient from the CSV
type Lead struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	CampaignID   uint      `gorm:"index" json:"campaign_id"`
	Email        string    `gorm:"index;not null" json:"email"`
	Data         string    `gorm:"type:json" json:"data"` // Raw CSV row data in JSON
	CurrentStep  int       `gorm:"default:1" json:"current_step"`
	Status       string    `gorm:"default:'pending'" json:"status"` // pending, sent, replied, failed
	NextActionAt time.Time `gorm:"index" json:"next_action_at"`
	LastMsgId    string    `json:"last_msg_id"` // For threading replies
}

// SenderAccount stores the SMTP/IMAP credentials
type SenderAccount struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Email      string    `gorm:"uniqueIndex;not null" json:"email"`
	SMTPHost   string    `json:"smtp_host"`
	SMTPPort   int       `json:"smtp_port"`
	IMAPHost   string    `json:"imap_host"`
	IMAPPort   int       `json:"imap_port"`
	Password   string    `json:"-"` // Neven export password to JSON
	DailyLimit int       `gorm:"default:50" json:"daily_limit"`
	SentCount  int       `gorm:"default:0" json:"sent_count"`
	IsActive   bool      `gorm:"default:true" json:"is_active"`
	LastUsedAt time.Time `json:"last_used_at"`
}

// CampaignSende links a specific email account to a specific campaign
type CampaignSender struct {
	CampaignID uint `gorm:"primaryKey"`
	SenderID   uint `gotm:"primaryKey"`
}

// GetMap returns the JSON data as a Go map for template replacement
func (l *Lead) GetMap() map[string]interface{} {
	var result map[string]interface{}
	json.Unmarshal([]byte(l.Data), &result)
	return result
}
