# Tarispace Setup Guide (Node.js + PostgreSQL)

This project now uses a Node.js backend with PostgreSQL for all dynamic data.

## 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+

## 2. Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Update backend/.env:

- DATABASE_URL
- JWT_SECRET
- ADMIN_RECOVERY_KEY
- CORS_ORIGIN

## 3. Initialize Database

```bash
npm run db:init
```

## 4. Start Backend

```bash
npm run dev
```

Backend API URL (default): http://localhost:4000/api

## 5. Frontend Run

Serve the frontend on a local server (for example VS Code Live Server on http://127.0.0.1:5500).

## 6. Admin Login

Default credentials come from backend/.env (first run only):

- Email: DEFAULT_ADMIN_EMAIL
- Password: DEFAULT_ADMIN_PASSWORD

Change these immediately in production.

## 7. Production Checklist

- Use a strong JWT_SECRET
- Set a strong ADMIN_RECOVERY_KEY
- Restrict CORS_ORIGIN to your real domain
- Use HTTPS
- Keep .env out of version control

## 8. Quick Verification (Recommended)

With backend running, execute:

```bash
cd backend
npm run verify:e2e
```

Expected pass conditions:

- Health and login return 200
- Admin service insert reflects in public `site-data`
- Contact message is inserted exactly once

## 9. Optional: Remove Existing Duplicate Messages

```bash
cd backend
npm run messages:dedupe
```

This keeps the oldest copy of identical messages and removes duplicates.
