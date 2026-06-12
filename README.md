# Developer-Focused Projects

Three mid-level full-stack web development projects built with **React + Vite + TailwindCSS** (frontend) and **Node.js + Express** (backend).

---

## Project 1 — GitHub Activity Tracker

| | |
|---|---|
| **Live Demo** | https://malikibraheem2023-spec.github.io/Developer-focused/ |
| **Branch** | [`github-tracker`](https://github.com/malikibraheem2023-spec/Developer-focused/tree/github-tracker) |

**Features:**
- Search any GitHub username and view their full profile
- Language breakdown pie chart across all repositories
- Commit activity heatmap calendar
- Top repositories sorted by stars and recent activity
- Google-style search suggestions with popular developer names
- Export portfolio as a shareable card

**Tech Stack:** React · Vite · TailwindCSS · Chart.js · GitHub REST API

```bash
git checkout github-tracker
cd github-tracker
npm install
npm run dev
# Open http://localhost:5173
```

---

## Project 2 — Mini Deploy Dashboard

| | |
|---|---|
| **GitHub** | [`deploy-dashboard`](https://github.com/malikibraheem2023-spec/Developer-focused/tree/deploy-dashboard) |
| **Branch** | `deploy-dashboard` |

**Features:**
- Add servers through a UI form (Host, Port, SSH Username, Password, Deploy Command)
- Live SSH ping to check if each server is Online or Offline
- Click Deploy — runs the deploy command on the remote server
- Real-time log streaming in a terminal window via WebSocket (Socket.io)
- Stream live `journalctl` logs from any server

**Tech Stack:** React · Vite · TailwindCSS · Node.js · Express · Socket.io · ssh2

```bash
git checkout deploy-dashboard
cd deploy-dashboard

# Start backend
cd server && npm install && node index.js

# Start frontend (new terminal)
cd .. && npm install && npm run dev
# Open http://localhost:5173
```

---

## Project 3 — URL Shortener + Analytics

| | |
|---|---|
| **GitHub** | [`url-shortener`](https://github.com/malikibraheem2023-spec/Developer-focused/tree/url-shortener) |
| **Branch** | `url-shortener` |

**Features:**
- Paste any long URL and get a short 7-character code instantly
- Every click is tracked automatically: country, referrer source, and timestamp
- Analytics dashboard per link with charts:
  - Clicks by country (bar chart)
  - Traffic source breakdown — Direct / WhatsApp / Google / etc. (pie chart)
  - Clicks over time by day (line chart)
- Copy short URL to clipboard with one click
- Delete any link with its full history

**Tech Stack:** React · Vite · TailwindCSS · Node.js · Express · SQLite (better-sqlite3) · geoip-lite · Chart.js

```bash
git checkout url-shortener
cd url-shortener

# Start backend
cd server && npm install && node index.js

# Start frontend (new terminal)
cd .. && npm install && npm run dev
# Open http://localhost:5173
```

---

## Tech Stack Overview

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Real-time | Socket.io (WebSockets) |
| Database | SQLite via better-sqlite3 (no installation needed) |
| Charts | Chart.js + react-chartjs-2 |
| SSH | ssh2 |
| Deployment | GitHub Pages (Project 1 only) |

---

## Repository Structure

```
Developer-focused/
├── main              ← this README
├── github-tracker    ← Project 1 (React only, deployed to GitHub Pages)
├── deploy-dashboard  ← Project 2 (React + Node.js backend)
└── url-shortener     ← Project 3 (React + Node.js backend + SQLite)
```

---

**Repository:** https://github.com/malikibraheem2023-spec/Developer-focused
