# Tarispace Portfolio

Professional portfolio website and admin dashboard for Tarispace, built as a modern multi-section static site with cloud-synced content management.

## Overview

This project includes:
- Public portfolio website (`index.html`)
- Admin dashboard (`admin.html`) and login page (`admin-login.html`)
- Blog article pages
- Portfolio/service/profile management
- Contact form message capture
- Cloud sync support through JSONbin (with localStorage fallback)

## Key Features

- Modern one-page portfolio UI with section navigation
- Dynamic content loading from shared data service
- Admin-managed profile, services, projects, skills, and blog items
- Contact form submissions visible in admin messages
- JSONbin-backed synchronization across devices/browsers
- Article-style blog pages with dedicated layouts

## Tech Stack

- HTML5
- CSS3
- JavaScript (vanilla)
- Bootstrap (CSS)
- jQuery + UI plugins
- JSONbin API (optional cloud persistence)

## Project Structure

```text
.
|- index.html
|- admin.html
|- admin-login.html
|- article-*.html
|- css/
|- js/
|- img/
|- SETUP_GUIDE.md
|- INSTALLATION.md
```

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/decodelover/tarispace-portfolio.git
cd tarispace-portfolio
```

2. Serve the project locally (recommended: local web server):
- VS Code Live Server, or
- Python:
```bash
python -m http.server 5502
```

3. Open:
- `http://127.0.0.1:5502/index.html`
- `http://127.0.0.1:5502/admin-login.html`

For full setup (including JSONbin), see `INSTALLATION.md`.

## Data Sync (JSONbin)

Update these values in `js/data-sync-service.js`:

```javascript
JSONBIN_BIN_ID: 'YOUR_BIN_ID_HERE',
JSONBIN_API_KEY: 'YOUR_API_KEY_HERE',
```

If not configured, the site can still run in localStorage mode (browser-only storage).

## Deployment

This repository is configured for static hosting (including GitHub Pages workflows in `.github/workflows`).

## Documentation

- `INSTALLATION.md` - full local setup + JSONbin configuration
- `SETUP_GUIDE.md` - project-specific dashboard setup notes
- `API_INTEGRATION_GUIDE.md` - backend API integration reference

## License

This project is licensed under the MIT License. See `LICENSE`.

