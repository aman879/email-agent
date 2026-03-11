// Package services handles the busniess logic for file processing and data mapping
package services

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"time"

	"github.com/aman879/email-agent-backend/internal/db"
	"github.com/aman879/email-agent-backend/internal/models"
)

type CSVService struct {
	Store *db.Store
}

// ProcessLeadCSV parses the uploaded file and stores dynamic colums as a JSON string
func (s *CSVService) ProcessLeadCSV(campaignID uint, file io.Reader) error {
	reader := csv.NewReader(file)
	headers, err := reader.Read()
	if err != nil {
		return err
	}

	var leads []models.Lead
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}

		if err != nil {
			return err
		}

		// Map every CSV column to a key-value pair
		rowData := make(map[string]string)
		email := ""
		for i, val := range record {
			rowData[headers[i]] = val
			// Identify the email column
			if headers[i] == "email" || headers[i] == "Email" {
				email = val
			}
		}

		// Convert the map to a JSON string for the "Data" field
		jsonBody, _ := json.Marshal(rowData)

		leads = append(leads, models.Lead{
			CampaignID:   campaignID,
			Email:        email,
			Data:         string(jsonBody),
			Status:       "pending",
			NextActionAt: time.Now(),
		})
	}

	// High-performace batch insert
	return s.Store.DB.CreateInBatches(leads, 100).Error
}
