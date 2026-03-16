// Package api_test contains unit tests for the API layer
package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodHead, "/health", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	h := &Handler{Store: nil}

	if assert.NoError(t, h.HealthCheck(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "online")
	}
}

func TestAddWorkflowStep(t *testing.T) {
	store := db.NewStore(":memory", "localhost:6379")
	e := echo.New()
	h := &Handler{Store: store}

	testTemplate := "Subject: Hello {{.name}} --- Hi {{.name}}, how is {{.company}}?"
	inputStep := models.WorkFlowStep{
		CampaignID: 1,
		StepOrder:  1,
		ActionType: "SEND_EMAIL",
		Templates:  []models.Template{{Body: testTemplate}},
	}

	jsonPayload, _ := json.Marshal(inputStep)

	req := httptest.NewRequest(http.MethodPost, "/campaigns/steps", bytes.NewBuffer(jsonPayload))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.AddWorkFlowStep(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)

		var savedStep models.WorkFlowStep
		err := store.DB.Preload("Templates").First(&savedStep).Error
		assert.NoError(t, err)
		assert.Equal(t, 1, len(savedStep.Templates))
		assert.Equal(t, testTemplate, savedStep.Templates[0].Body)
		assert.Equal(t, 1, savedStep.StepOrder)
	}
}
