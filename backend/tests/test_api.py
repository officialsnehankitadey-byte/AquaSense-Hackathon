import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.fft_processor import fft_processor
from app.ai.repair_optimizer import repair_optimizer

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["system"] == "AquaSense API Gateway"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_kpis():
    response = client.get("/api/telemetry/kpis")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    assert data[0]["title"] == "Network Health Index"

def test_get_nodes():
    response = client.get("/api/telemetry/nodes")
    assert response.status_code == 200
    nodes = response.json()
    assert len(nodes) >= 6

def test_incidents_list():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 4

def test_acoustic_spectrum():
    response = client.get("/api/incidents/inc-101/acoustic-spectrum")
    assert response.status_code == 200
    data = response.json()
    assert "frequencies" in data
    assert "magnitudes" in data
    assert data["peakFrequencyHz"] > 0

def test_repair_priorities():
    response = client.get("/api/repairs/priorities")
    assert response.status_code == 200
    priorities = response.json()
    assert len(priorities) >= 1
    assert priorities[0]["rank"] == 1
    assert priorities[0]["structuralRiskScore"] > 0

def test_prv_adjustment():
    response = client.post("/api/sensors/prv/adjust", json={"nodeId": "node-4", "targetPressurePsi": 55.0})
    assert response.status_code == 200
    assert response.json()["status"] == "SUCCESS"

def test_demo_triggers():
    # Trigger burst
    res_burst = client.post("/api/demo/trigger-burst")
    assert res_burst.status_code == 200
    assert res_burst.json()["status"] == "BURST_INJECTED"
    
    # Reset
    res_reset = client.post("/api/demo/reset")
    assert res_reset.status_code == 200
    assert res_reset.json()["status"] == "RESET_COMPLETE"
