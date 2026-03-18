# Node.js + PostgreSQL Migration Plan for Tarispace

This guide maps your current frontend flow to the backend in the `backend` folder.

## 1. Start Backend

```bash
cd backend
npm install
copy .env.example .env
npm run db:init
npm run dev
```

## 2. Endpoint Mapping

Current module -> New endpoint:

- Admin login -> `POST /api/auth/login`
- Profile -> `GET/PUT /api/profile`
- Services -> `GET/POST/PUT/DELETE /api/services`
- Projects -> `GET/POST/PUT/DELETE /api/projects`
- Blog -> `GET/POST/PUT/DELETE /api/blog`
- Messages -> `GET/DELETE /api/messages`
- Skills -> `GET/POST/PUT/DELETE /api/skills`
- Settings -> `GET/PUT /api/settings`
- Main site data -> `GET /api/public/site-data`
- Contact form -> `POST /api/public/messages`

## 3. Frontend Auth Example (replace login verification)

```javascript
const response = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

if (!response.ok) {
  throw new Error('Invalid email or password');
}

const data = await response.json();
localStorage.setItem('authData', JSON.stringify({
  email,
  token: data.token,
  loginTime: new Date().toISOString()
}));

// Use the credentials set in backend/.env:
// DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD
```

## 4. API Client Example for Admin Dashboard

```javascript
const API_BASE = 'http://localhost:4000/api';

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem('authData') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.token || ''}`
  };
}

async function getProfile() {
  const response = await fetch(`${API_BASE}/profile`, {
    headers: authHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to load profile');
  }

  return response.json();
}
```

## 5. Main Site Data Load

Use backend fetch:

```javascript
const response = await fetch('http://localhost:4000/api/public/site-data');
const siteData = await response.json();
```

Use this response to hydrate sections like profile, projects, and blog list.

## 6. Safe Rollout Strategy

1. Integrate login with the backend first.
2. Move profile + services next.
3. Move blog + projects.
4. Move messages + settings.
5. Remove any old client-side credentials from frontend files.

## 7. Production Notes

- Use a strong `JWT_SECRET`.
- Restrict `CORS_ORIGIN` to your domain.
- Use HTTPS in production.
- Rotate default admin credentials immediately.
- Store secrets in server environment, not frontend files.
