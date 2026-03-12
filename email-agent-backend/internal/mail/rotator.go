// Package mail provides rotation logic to selct from multipler sender account
package mail

import (
	"errors"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
)

// GetAvialbleSender sleects an active sender account under its daily limit
func GetAvialbleSender(store *db.Store, campaignID uint) (*models.SenderAccount, error) {
	var account models.SenderAccount

	result := store.DB.Table("sender_accounts").
		Joins("JOIN campaign_senders ON campaign_senders.sender_id = sender_accounts.id").
		Where("campaign_senders.campaign_id = ?", campaignID).
		Where("sender_accounts.is_active = ? AND sender_accounts.sent_count < sender_accounts.daily_limit", true).
		Order("sender_accounts.last_used_at ASC").
		First(&account)

	if result.Error != nil {
		return nil, errors.New("no authorized sender accounts availabe for this campaign")
	}

	return &account, nil
}
