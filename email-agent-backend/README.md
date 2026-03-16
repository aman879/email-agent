# Email Agent Backend

The Go-based engine powering the AI Email Automation Agent. This service handles the REST API, background workers for email dispatch, and IMAP reply monitoring.

---

## 🛠️ Tech Stack

- **Language**: Go 1.26+
- **Web Framework**: [Echo](https://echo.labstack.com/)
- **Database**: SQLite (managed with Gorm)
- **Cache / Distributed Lock**: Redis
- **Reliability**: Atomic operations for email state management.

---

## 🏗️ Architecture

The backend is structured into two main components:
1. **API Server**: Handles campaign management, lead uploads, and settings.
2. **Worker Engine**: A background process that scans the database for pending emails and schedules them using a token-bucket approach for rate limiting and inbox rotation.

---

## 📁 Package Structure

```text
internal/
├── api/        # REST handlers and route definitions
├── config/     # Environment variable management
├── db/         # Database initialization and connection
├── mail/       # SMTP/IMAP protocol logic and rotation
├── models/     # Gorm database schemas
├── services/   # Business logic (CSV parsing, template rendering)
└── worker/     # Ticker-based background job logic
```

---

## 🚀 Getting Started

### 📦 Prerequisites
- Go 1.26+
- Redis (running locally or via Docker)
- SQLite

### ⚙️ Environment Variables
Create a `.env` file in the root of the backend directory:

```env
PORT=8080
DB_PATH=agent.db
REDIS_ADDR=localhost:6379
# (Optional) SMTP/IMAP settings if not managed via DB
```

### 🏃 Running Locally

1. **Install Dependencies**:
   ```bash
   go mod download
   ```

2. **Start the Service**:
   ```bash
   go run cmd/api/main.go
   ```

The server will initialize the SQLite database (`agent.db`) and start listening on the configured port.

---

## 🛣️ API Endpoints (Brief)

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Health check |
| `/campaigns` | `GET` | List all campaigns |
| `/campaigns/upload` | `POST` | Upload CSV and create campaign |
| `/settings/accounts` | `POST` | Configure SMTP/IMAP accounts |

---

## 🧪 Testing

Run all unit tests:
```bash
go test ./internal/...
```

---

## ⚖️ Database State Machine

The agent uses a strict status workflow for leads:
`PENDING` ➔ `SENT` ➔ `CLICKED/OPENED` (optional) ➔ `REPLIED` (halts sequence).
Each state transition is logged to ensure no duplicate emails are sent even if the worker restarts.
