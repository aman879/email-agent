package services

import (
	"strings"
	"testing"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestProcessLeadCsv(t *testing.T) {
	store := db.NewStore(":memory:", "localhost:6379")
	svc := CSVService{Store: store}

	csvData := "email,name,company\ntest@example.com,Jhon Doe, AI Corp"
	reader := strings.NewReader(csvData)

	err := svc.ProcessLeadCSV(1, reader)
	assert.NoError(t, err)

	var lead models.Lead
	store.DB.First(&lead)
	assert.Equal(t, "test@example.com", lead.Email)
	assert.Contains(t, lead.Data, "Jhon Doe")
}
