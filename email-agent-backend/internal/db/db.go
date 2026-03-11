// Package db handles database connection and migrations
package db

import (
	"log"

	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Store holds the databse and redis connections for the app
type Store struct {
	DB    *gorm.DB
	Redis *redis.Client
}

// NEwStore intializes SQLite with WAL mode and connects to redis.
func NewStore(dbPath string, redisAdrr string) *Store {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to SQLite: %v", err)
	}

	db.Exec(("PRAGMA journal_mode=WAL;"))

	err = db.AutoMigrate(
		&models.Campaign{},
		&models.WorkFlowStep{},
		&models.Lead{},
		&models.SenderAccount{},
	)
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	rdb := redis.NewClient(&redis.Options{
		Addr: redisAdrr,
	})

	return &Store{
		DB:    db,
		Redis: rdb,
	}
}
