# Email Agent Frontend

The modern, high-performance dashboard for managing the AI Email Automation Agent. Built with **React 19**, **Vite**, and **Tailwind CSS 4.0**.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Functional Components + Hooks)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router) — Type-safe routing for React.
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) — Asynchronous state management.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🏗️ Project Architecture

The project follows a **Feature-Based** structure to ensure scalability and maintainability:

```text
src/
├── assets/         # Static assets (images, global fonts)
├── components/     # Shared, reusable UI components (Buttons, Inputs, etc.)
├── features/       # Domain-specific modules
│   ├── dashboard/  # Analytics and overview
│   ├── campaigns/  # Campaign creation and tracking
│   └── settings/   # Account and profile management
├── lib/            # External library configurations (Axios, QueryClient)
├── routes/         # TanStack Router route definitions
└── main.tsx        # Application entry point
```

---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js 18+
- npm or yarn

### 🏃 Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Dev Server**:
   ```bash
   npm run dev
   ```

The dashboard will be available at `http://localhost:5173`.

### 🔨 Building for Production

```bash
npm run build
```
This generates a highly optimized static bundle in the `dist/` directory.

---

## 🧩 Key Features

- **📊 Dynamic Dashboard**: Real-time visualization of outreach progress.
- **📁 CSV Workflow**: Drag-and-drop lead ingestion with field mapping.
- **⚙️ Setup Wizard**: Multi-step configuration for SMTP/IMAP credentials.
- **🌑 Modern UI**: Sleek, high-contrast design with glassmorphism and smooth transitions.

---

## 🛡️ Routing & Data

This project utilizes **TanStack Router** for full type safety across all navigation. API communication is abstracted through **Axios** and managed via **TanStack Query** for robust caching and optimistic updates.
