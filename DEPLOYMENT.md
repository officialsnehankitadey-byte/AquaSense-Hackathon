# 🚀 AquaSense Production Deployment Guide

This repository is fully configured for automated cloud deployment across **Render**, **Railway**, **Vercel**, and **Docker**.

---

## 🌟 Option 1: Render.com (Recommended - Zero Configuration)

Render natively supports both Python FastAPI (with WebSockets) and Next.js.

### Steps:
1. Push your repository to GitHub (already up to date!).
2. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
3. Click **New Blueprint Instance**.
4. Connect your GitHub repository `officialsnehankitadey-byte/AquaSense-Hackathon`.
5. Render will automatically detect `render.yaml` and provision:
   - **`aquasense-backend`** (FastAPI Python Web Service with WebSocket support)
   - **`aquasense-frontend`** (Next.js Production Web Application)
6. Click **Apply**. Both services will build and deploy live with HTTPS and WSS automatically!

---

## ⚡ Option 2: Vercel (Frontend) + Render / Railway (Backend)

### A. Deploy Backend (Render or Railway)
1. On [Render.com](https://render.com) or [Railway.app](https://railway.app), create a new **Web Service**.
2. Select your repository and set the Root Directory to `backend`.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Note your live backend URL (e.g., `https://aquasense-backend.onrender.com`).

### B. Deploy Frontend to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Import `officialsnehankitadey-byte/AquaSense-Hackathon`.
3. Set Root Directory to `frontend`.
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://aquasense-backend.onrender.com/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://aquasense-backend.onrender.com/ws/telemetry`
5. Click **Deploy**.

---

## 🐳 Option 3: Docker / Docker Compose (Any Cloud VPS / AWS / DigitalOcean)

To run the entire full-stack application on any Linux/Windows server with Docker installed:

```bash
# Clone repository
git clone https://github.com/officialsnehankitadey-byte/AquaSense-Hackathon.git
cd AquaSense-Hackathon

# Launch full-stack services in background
docker-compose up -d --build
```

### Accessing your containerized application:
- **Frontend Dashboard**: `http://<your-server-ip>:3000`
- **FastAPI Backend Gateway**: `http://<your-server-ip>:8000`
- **API Documentation**: `http://<your-server-ip>:8000/docs`

---

## 📋 Environment Variables Reference

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base HTTP endpoint for FastAPI | `https://api.aquasense.io/api` |
| `NEXT_PUBLIC_WS_URL` | Base WebSocket endpoint for SCADA telemetry | `wss://api.aquasense.io/ws/telemetry` |
