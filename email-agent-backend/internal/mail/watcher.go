// Package mail handles the IMAP connection logic for reply direction
package mail

import (
	"fmt"
	"log"
	"time"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/emersion/go-imap"
	"github.com/emersion/go-imap/client"
)

// Watcher manages the polling of multipler email agents
type Watcher struct {
	Store *db.Store
}

// CheckAllInboxed loops through every active sender account to look for replies
func (w *Watcher) CheckAllInboxed() {
	var accounts []models.SenderAccount

	w.Store.DB.Where("is_active =?", true).Find(&accounts)

	for _, acc := range accounts {
		w.processInbox(&acc)
	}
}


func (w *Watcher) processInbox(acc *models.SenderAccount) {

	imapAddr := fmt.Sprintf("%s:%d", acc.IMAPHost, acc.IMAPPort)
	c, err := client.DialTLS(imapAddr, nil)

	if err != nil {
		log.Printf("IMAP Error: Login failed for %s: %v", acc.Email, err)
		return
	}

	defer c.Logout()

	if err := c.Login(acc.Email, acc.IMAPPassword); err != nil {
		log.Printf("IMAP Authentication Failed [%s]. Check App Password: %v", acc.Email, err)
		return
	}

	_, err = c.Select("INBOX", true)
	if err != nil {
		return
	}

	criteria := imap.NewSearchCriteria()
	criteria.WithoutFlags = []string{imap.SeenFlag}
	ids, err := c.Search(criteria)

	if err != nil || len(ids) == 0 {
		return
	}

	seqset := new(imap.SeqSet)
	seqset.AddNum(ids...)

	messages := make(chan *imap.Message, 10)
	done := make(chan error, 1)
	go func() {
		done <- c.Fetch(seqset, []imap.FetchItem{imap.FetchEnvelope}, messages)
	}()

	for msg := range messages {
		if len(msg.Envelope.From) == 0 {
			continue
		}

		senderEmail := msg.Envelope.From[0].Address()

		w.processDetectedReply(senderEmail)
	}

	if err := <-done; err != nil {
		log.Printf("IMAP fetch error [%s]: %v", acc.Email, err)
	}
}

func (w *Watcher) processDetectedReply(email string) {
	result := w.Store.DB.Model(&models.Lead{}).
		Where("email = ? AND status IN ?", email, []string{"sent", "waiting"}).
		Update("status", "replied")

	if result.RowsAffected > 0 {
		log.Printf("REPLY MATCHED: Lead %s has been moved to 'replied' status. Sequence terminated!!.", email)

		w.Store.DB.Create(&models.ActivityLog{
			Type: "info",
			Message: "Lead " + email + "replied. Future follow-ups cancelled",
			CreatedAt: time.Now(),
		})
	}
}

