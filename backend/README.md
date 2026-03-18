# Tarispace Backend (Node.js + PostgreSQL)

This backend is the primary data layer for the portfolio, using Express and PostgreSQL.

## Features

- JWT admin authentication
- CRUD endpoints for profile, services, projects, blog, messages, skills, and settings
- Public endpoints for site data and contact messages
- Database bootstrap script with default admin + starter data

## Quick Start

1. Install dependencies

```bash
cd backend
npm install
```

2. Create environment file

```bash
copy .env.example .env
```

3. Update database and secrets in `.env`

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`

4. Initialize database

```bash
npm run db:init
```

5. Start API server

```bash
npm run dev
```

The API starts at `http://localhost:4000` by default.

## Daily Local Workflow

1. Start backend:

```bash
npm run dev
```

2. Serve frontend from local web server (for example VS Code Live Server).

3. Edit content in admin UI and verify public reflection:

```bash
npm run verify:e2e
```

4. If you previously had duplicate contact rows, clean them once:

```bash
npm run messages:dedupe
```

## Default Admin Login

- Email: `admin@example.com`
- Password: `demo123`

Change this immediately in production by updating `DEFAULT_ADMIN_PASSWORD` before first run.

## API Overview

### Public routes

- `GET /api/health`
- `GET /api/public/site-data`
- `POST /api/public/messages`

### Auth route

- `POST /api/auth/login`

### Protected routes (`Authorization: Bearer <token>`)

- `GET, PUT /api/profile`
- `GET, POST /api/services`
- `PUT, DELETE /api/services/:id`
- `GET, POST /api/projects`
- `PUT, DELETE /api/projects/:id`
- `GET, POST /api/blog`
- `PUT, DELETE /api/blog/:id`
- `GET /api/messages`
- `DELETE /api/messages/:id`
- `GET, POST /api/skills`
- `PUT, DELETE /api/skills/:id`
- `GET, PUT /api/settings`
- `GET /api/stats`

## Sync Live Data To Local

Use this when you want your local `tarispace_db` to mirror production content.

1. Set these values in `backend/.env`:

- `PROD_API_BASE` (default `https://www.tarispace.me/api`)
- `PROD_ADMIN_EMAIL` (optional, only for syncing messages)
- `PROD_ADMIN_PASSWORD` (optional, only for syncing messages)

2. Run:

```bash
npm run sync:prod
```

This sync is one-way and safe:

- Reads data from production API
- Writes data into local PostgreSQL
- Never writes back to production

## Production Deployment Checklist

1. Copy `backend/.env.production.example` to your host environment variables.
2. Set strong secrets for `JWT_SECRET` and `ADMIN_RECOVERY_KEY`.
3. Set `DATABASE_URL` to your production PostgreSQL.
4. Restrict `CORS_ORIGIN` to your real domains only.
5. Run DB init once on production:

```bash
npm run db:init
```

6. Optionally seed initial content:

```bash
npm run db:seed:full
```

7. Start API in production mode:

```bash
npm start
```

8. Run API with a process manager (PM2 example):

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
```

9. Put the API behind HTTPS (Nginx/Caddy/hosting proxy) and forward traffic to the Node port.

## Frontend Integration Notes

- Replace `DataSyncService` calls in admin scripts with fetch calls to this backend.
- Save JWT token after login and attach it in `Authorization` headers.
- For your live site, load content from `GET /api/public/site-data`.
