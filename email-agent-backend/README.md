# AI Email Automation Agent

> **⚠️ UNDER ACTIVE DEVELOPMENT** — API endpoints, database schema, and core logic are subject to breaking changes. This documentation reflects the current development state and may not be fully accurate.

A 24/7 autonomous email outreach and monitoring system. Built with a high-concurrency **Go** backend and a **React + Vite** frontend, designed to manage bulk email campaigns with dynamic templates, inbox rotation, and real-time reply detection.

---

## Features

| Feature | Description |
|---|---|
| **24/7 Background Worker** | Autonomous engine for scheduling and sending emails without manual intervention |
| **Dynamic CSV Ingestion** | Import leads with custom headers used as variables in email templates |
| **Inbox Rotation** | Load-balance outgoing mail across multiple SMTP/IMAP accounts |
| **State Machine Engine** | Manages complex follow-up sequences based on user-defined timeframes |
| **Reply Monitoring** | Real-time thread tracking — automatically halts sequences on recipient reply |
| **Conditional Logic** | Route templates dynamically based on lead data filters |

---

## Project Structure

```
.
├── email-agent-backend/       # Go 1.21+ REST API & background worker
│   ├── cmd/api/               # Entrypoint
│   └── internal/
│       ├── models/            # SQLite schema definitions
│       ├── worker/            # 24/7 ticker logic for email dispatch
│       ├── services/          # CSV parsing & template rendering
│       └── mail/              # SMTP connections & rotation logic
├── email-agent-frontend/      # React + Vite dashboard
└── docker-compose.yml         # Orchestrates backend, frontend, and Redis
```

---

## Tech Stack

### Backend
- **Language:** Go 1.21+
- **Framework:** [Echo](https://echo.labstack.com/) — high-performance REST API
- **Database:** SQLite (WAL mode for concurrent access)
- **Cache / Queue:** Redis
- **ORM:** GORM

### Frontend
- **Framework:** React 18 (with Hooks)
- **Bundler:** Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Go 1.21+ *(for local backend development)*
- Node.js 18+ *(for local frontend development)*

---

### Option 1 — Docker (Recommended)

```bash
git clone <repo-url>
cd <repo>
docker-compose up --build
```

This starts the backend, frontend, and Redis together.

---

### Option 2 — Local Development

#### Backend

```bash
cd email-agent-backend
go mod tidy
```

Create a `.env` file:

```env
PORT=8080
DB_PATH=agent.db
REDIS_ADDR=localhost:6379
```

Start the API and worker:

```bash
go run cmd/api/main.go
```

#### Frontend

```bash
cd email-agent-frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` by default.

---

## API Reference

> Base URL: `http://localhost:8080`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System status check |
| `POST` | `/campaigns/upload` | Upload CSV and map leads |
| `POST` | `/settings/accounts` | Add SMTP/IMAP credentials |
| `GET` | `/campaigns` | List all active sequences |

---

## Testing

Run unit tests for all backend packages:

```bash
go test ./internal/...
```

---

## Contributing

This project is under active development. Contributions, issues, and feature requests are welcome. Please open an issue before submitting a pull request to discuss proposed changes.
