// Package mail handles SMTP connections and template rendering for outgoin emails.
package mail

import (
	"bytes"
	"fmt"
	"net/smtp"
	"strings"
	"text/template"
)

// EmailRequest holds the data needed to send a single mail
type EmailRequest struct {
	From         string
	To           string
	Subject      string
	Body         string
	Identity     string
	SMTPUser     string
	SMTPPassword string
	Host         string
	Port         int
}

// RenderTemplate is a generic helper to render both subject and Body
func RenderTemplate(raw string, data map[string]interface{}) (string, error) {
	tmpl, err := template.New("msg").Parse(raw)
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

// SendRawEmail execute the actual SMTP transaction
func SendRawEmail(req EmailRequest) error {
	auth := smtp.PlainAuth(req.Identity, req.SMTPUser, req.SMTPPassword, req.Host)

	// Construct the standard RFC 822 email format
	msg := []byte("From: " + req.From + "\r\n" +
		"To: " + req.To + "\r\n" +
		"Subject: " + req.Subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"\r\n" +
		req.Body + "\r\n")

	addr := fmt.Sprintf("%s:%d", req.Host, req.Port)
	return smtp.SendMail(addr, auth, req.From, []string{req.To}, msg)
}

// ParseTemplate splits a combined string into a Subject and Body
// It looks for "---" separator
func ParseTemplate(fullTemplate string) (string, string, error) {
	parts := strings.SplitN(fullTemplate, "---", 2)
	if len(parts) < 2 {
		return "", "", fmt.Errorf("invalid template format: missing '---' separator")
	}

	subject := strings.TrimSpace(strings.Replace(parts[0], "Subject", "", 1))
	body := strings.TrimSpace(parts[1])

	return subject, body, nil
}
