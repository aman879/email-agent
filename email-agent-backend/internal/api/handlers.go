// Package api handles the HTTP request-response logic/
package api

import (
	"net/http"
	"strconv"

	"github.com/aman879/email-agent-backend/internal/db"
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

	return c.JSON(http.StatusOK, map[string]string {
		"message": "Successfully imported leads and mapped dynamic columns",
	})
}
