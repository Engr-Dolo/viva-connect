# VIVA Connect

VIVA Connect is a production-oriented volunteer and impact management system for mission-driven organizations.

## Phase 1 Setup

This repository is split into two applications:

- `backend`: Node.js, Express, Mongoose, centralized middleware, and REST API structure.
- `frontend`: React, Vite, Tailwind CSS, and a responsive dashboard shell.

## Local Development

Create `backend/.env` from `backend/.env.example`, then add the MongoDB Atlas connection string. The backend requires `MONGODB_URI` in every environment and will stop startup if it is missing.

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The backend exposes `GET /api/health` and the frontend expects the API at `http://localhost:5000/api` by default.
