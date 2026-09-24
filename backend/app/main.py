from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.routers import telemetry, incidents, sensors, repairs, demo
from app.api import ws

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AquaSense API Gateway",
    description="AI Hydro-Acoustic Leak Detection & Smart Water Grid Intelligence Backend",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(telemetry.router)
app.include_router(incidents.router)
app.include_router(sensors.router)
app.include_router(repairs.router)
app.include_router(demo.router)
app.include_router(ws.router)

@app.get("/")
def root():
    return {
        "system": "AquaSense API Gateway",
        "status": "ONLINE",
        "docs": "/docs",
        "websocket": "/ws/telemetry"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
