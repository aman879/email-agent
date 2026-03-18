// Package main is the entry point for the Email AI Agent API.
// It initializes the database, wires up dependencies, and starts the HTTP server
package main

import (
	"fmt"
	"log"
	"time"

	"github.com/aman879/email-agent-backend/internal/api"
	"github.com/aman879/email-agent-backend/internal/config"
	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/mail"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Load system configurations
	cfg := config.LoadConfig()
	store := db.NewStore(cfg.DBPath, cfg.RedisAddr)

	watcher := &mail.Watcher{Store: store}
	go func() {
		log.Printf("Reply Watcher started...")
		ticker := time.NewTicker(1 * time.Minute)
		for range ticker.C {
			log.Printf("Watcher: Checking for new replies...")
			watcher.CheckAllInboxed()
		}
	}()

	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	h := &api.Handler{Store: store}
	e.GET("/health", h.HealthCheck)
	e.GET("/campaigns", h.ListCampaigns)
	e.POST("/campaigns", h.CreateCampaign)
	e.POST("/campaigns/steps", h.AddWorkFlowStep)
	e.POST("/campaigns/upload", h.UploadCSV)

	 e.GET("/senders", h.ListSenders)
	e.POST("/senders", h.AddSenderAccount)
	e.DELETE("/senders/:id", h.DeleteSenderAccount)
	e.POST("/senders/link", h.LinkSenderToCampaign)

	e.GET("/stats", h.GetStats)

	e.POST("/worker/start", h.StartWorker)

	e.Logger.Fatal(e.Start(":" + cfg.Port))
	serverPort := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Starting AI Agent Backend on %s", serverPort)

	if err := e.Start(serverPort); err != nil {
		log.Fatalf("Critical server failure: %v", err)
	}
}
