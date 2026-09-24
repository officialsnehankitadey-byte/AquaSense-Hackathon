from fastapi import APIRouter
from app.simulator.telemetry_generator import simulator
from app.api.routers.incidents import INCIDENTS_DB
from app.models.schemas import Incident

router = APIRouter(prefix="/api/demo", tags=["Hackathon Presentation Suite"])

@router.post("/trigger-burst")
def trigger_burst_scenario():
    simulator.trigger_burst()
    
    burst_incident = Incident(
        id=f"inc-burst-{len(INCIDENTS_DB)+1}",
        code="BURST-DEMO-999",
        location="High-Pressure Main Feed (32nd Ave & Oak St)",
        dmaZone="DMA-03 Industrial District East",
        severity="CRITICAL",
        confidence=99.2,
        estimatedLossGpm=310,
        estimatedDailyCost=3450,
        detectedTime="Just now",
        status="UNASSIGNED",
        pipeType="Cast Iron",
        pipeDiameter="24 in",
        acousticFreq=420,
        pressureDropPsi=28.5,
        summary="LIVE ANOMALY INJECTED: Pipe burst detected on 24 in main line with 28.5 PSI catastrophic drop.",
        repairPriority=1,
        suspectedSegment="Pipe Segment #pipe-5 (Node-4 → Node-5)",
        recommendedAction="EMERGENCY ISOLATION REQUIRED IMMEDIATELY. Rapid soil saturation detected.",
    )
    INCIDENTS_DB.insert(0, burst_incident)
    
    return {
        "status": "BURST_INJECTED",
        "message": "Live pipe burst event injected into SCADA stream.",
        "incident": burst_incident
    }

@router.post("/reset")
def reset_demo_scenario():
    simulator.reset_simulation()
    # Clean out demo bursts
    global INCIDENTS_DB
    INCIDENTS_DB[:] = [inc for inc in INCIDENTS_DB if not inc.code.startswith("BURST-DEMO")]
    return {
        "status": "RESET_COMPLETE",
        "message": "SCADA simulation and incidents reset to baseline state."
    }
