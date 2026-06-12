# Mini Deploy Dashboard

Add servers via UI, check SSH reachability, stream live logs, and trigger deploys — all from the browser.

## Features

- Add / edit / delete servers via UI (stored in `server/servers.json`)
- Password or private key authentication
- SSH ping — live online/offline status per server
- 🚀 Deploy button — runs your deploy command over SSH, streams output in real-time via WebSocket
- 📋 Logs button — streams last 50 journal/app log lines from the server

## Stack

- **Frontend:** React + Vite + TailwindCSS + Socket.io-client
- **Backend:** Node.js + Express + Socket.io + ssh2

## Run

```bash
# Terminal 1 — backend
cd server
npm install
npm run dev

# Terminal 2 — frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:4000
