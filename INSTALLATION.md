# Installation Guide

This guide helps you run the Tarispace portfolio locally and enable cloud sync with JSONbin.

## 1. Prerequisites

- Git
- A modern browser (Chrome, Edge, Firefox)
- Local server tool:
  - VS Code Live Server, or
  - Python 3 (`python -m http.server`)

## 2. Clone the Repository

```bash
git clone https://github.com/decodelover/tarispace-portfolio.git
cd tarispace-portfolio
```

## 3. Configure JSONbin (Recommended)

The admin dashboard and public site share content through `js/data-sync-service.js`.

1. Create a free account at `https://jsonbin.io`
2. Create a new bin with:
```json
{}
```
3. Copy your Bin ID
4. Create an API key with Read + Update permissions
5. Open `js/data-sync-service.js` and update:
```javascript
JSONBIN_BIN_ID: 'YOUR_BIN_ID_HERE',
JSONBIN_API_KEY: 'YOUR_API_KEY_HERE',
```

If these values are not set, the project falls back to localStorage (device/browser only).

## 4. Run Locally

### Option A: VS Code Live Server

- Open the project folder in VS Code
- Right-click `index.html`
- Click "Open with Live Server"

### Option B: Python HTTP Server

```bash
python -m http.server 5502
```

Then open:
- `http://127.0.0.1:5502/index.html`
- `http://127.0.0.1:5502/admin-login.html`

## 5. Verify Core Flows

- Website sections render correctly
- Admin login opens dashboard
- Edit profile/service/portfolio/blog in admin and save
- Refresh main site to confirm synced updates
- Submit contact form and confirm message appears in admin

## 6. Deployment

Deploy as a static website (GitHub Pages, Netlify, Vercel static, or cPanel hosting).

Ensure all project files/folders are uploaded, especially:
- `index.html`
- `admin.html`
- `admin-login.html`
- `js/`
- `css/`
- `img/`

## 7. Troubleshooting

### Changes do not sync
- Confirm internet access
- Verify JSONbin Bin ID and API key
- Check browser console for request errors

### Contact messages not showing in admin
- Confirm JSONbin setup is correct
- Ensure `js/data-sync-service.js` is loaded on both site and admin pages

### Assets missing
- Check folder names and file paths exactly (case-sensitive on many hosts)

