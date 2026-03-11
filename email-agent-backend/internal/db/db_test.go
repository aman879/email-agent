package db

import (
	"testing"

	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/stretchr/testify/assert"
)


func TestAutoMigration(t *testing.T) {
	// using a memory-based SQLite for testinf to keep it fast and clean
	store := NewStore(":memory:", "localhost:6379")

	hashTable := store.DB.Migrator().HasTable(&models.Campaign{})
	assert.True(t, hashTable, "Campagin table should exists after migration")

	hasLeadTable := store.DB.Migrator().HasTable(&models.Lead{})
	assert.True(t, hasLeadTable, "Lead table should exist after migration")
}
