from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Incident, DispatchCrewRequest
from app.ai.fft_processor import fft_processor

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

# In-memory incident store for real-time reactivity
INCIDENTS_DB: List[Incident] = [
    Incident(
        id="inc-101",
        code="LEAK-2026-881",
        location="Sector 4B - Main Feed (32nd Ave & Oak St)",
        dmaZone="DMA-03 Industrial District East",
        severity="CRITICAL",
        confidence=97,
        estimatedLossGpm=145,
        estimatedDailyCost=1680,
        detectedTime="12 mins ago",
        status="INVESTIGATING",
        pipeType="Ductile Iron",
        pipeDiameter="18 in",
        acousticFreq=340,
        pressureDropPsi=14.2,
        summary="Sudden pressure drop of 14.2 PSI with high-pitch 340Hz acoustic resonance signature detected by Acoustic Sensor AS-402.",
        repairPriority=1,
        suspectedSegment="Pipe Segment #pipe-6 (Node-4 PRV-12 → Node-7 AS-402)",
        recommendedAction="Immediate isolation of Valve V-402 required. High probability of sinkhole erosion under 32nd Ave if unaddressed for >6 hours.",
    ),
    Incident(
        id="inc-102",
        code="LEAK-2026-879",
        location="North Reservoir Feeder Junction B",
        dmaZone="DMA-01 North Ridge Reservoir",
        severity="HIGH",
        confidence=91,
        estimatedLossGpm=82,
        estimatedDailyCost=950,
        detectedTime="1 hr ago",
        status="DISPATCHED",
        assignedCrew="Field Response Crew Alpha",
        pipeType="Cast Iron",
        pipeDiameter="12 in",
        acousticFreq=285,
        pressureDropPsi=8.7,
        summary="Acoustic sensor correlation between AS-109 and AS-112 indicates joint displacement leak near PRV-12.",
        repairPriority=2,
        suspectedSegment="Pipe Segment #pipe-2 (Node-2 Pump Station → Node-3 AS-109)",
        recommendedAction="Field Crew Alpha dispatched. Adjust PRV-12 pressure threshold to 52 PSI to reduce burst energy during excavation.",
    ),
    Incident(
        id="inc-103",
        code="LEAK-2026-874",
        location="Sub-DMA 4C Commercial Loop",
        dmaZone="DMA-03 Industrial District East",
        severity="HIGH",
        confidence=84,
        estimatedLossGpm=45,
        estimatedDailyCost=520,
        detectedTime="3 hrs ago",
        status="ACKNOWLEDGED",
        pipeType="PVC Schedule 80",
        pipeDiameter="8 in",
        acousticFreq=510,
        pressureDropPsi=5.3,
        summary="Micro-fissure anomaly flagged by pressure differential algorithm across sub-metering nodes.",
        repairPriority=3,
        suspectedSegment="Pipe Segment #pipe-8 (Node-4 → Sub-DMA 4C)",
        recommendedAction="Schedule acoustic correlation survey during low-demand night hours (02:00-04:00 AM).",
    ),
    Incident(
        id="inc-104",
        code="LEAK-2026-869",
        location="Eastside Distribution Branch #14",
        dmaZone="DMA-04 Westside Residential",
        severity="MEDIUM",
        confidence=78,
        estimatedLossGpm=22,
        estimatedDailyCost=260,
        detectedTime="5 hrs ago",
        status="UNASSIGNED",
        pipeType="Steel Encased",
        pipeDiameter="10 in",
        acousticFreq=215,
        pressureDropPsi=3.1,
        summary="Gradual drift in minimum night flow (MNF) baseline. Suspected flange gasket seepage.",
        repairPriority=4,
        suspectedSegment="Pipe Segment #pipe-12 (Node-6 PS-301 → Branch 14)",
        recommendedAction="Monitor pressure trends over 24-hour cycle before dispatching repair crew.",
    )
]

@router.get("", response_model=List[Incident])
def get_incidents():
    return INCIDENTS_DB

@router.post("/{incident_id}/dispatch", response_model=Incident)
def dispatch_crew(incident_id: str, body: DispatchCrewRequest):
    for inc in INCIDENTS_DB:
        if inc.id == incident_id:
            inc.status = "DISPATCHED"
            inc.assignedCrew = body.crewName
            return inc
    raise HTTPException(status_code=404, detail="Incident not found")

@router.get("/{incident_id}/acoustic-spectrum")
def get_acoustic_spectrum(incident_id: str):
    inc = next((i for i in INCIDENTS_DB if i.id == incident_id), None)
    freq = inc.acousticFreq if inc else 340.0
    audio_signal = fft_processor.generate_synthetic_audio(duration=1.0, is_leak=True, leak_freq=freq)
    analysis = fft_processor.analyze_audio_spectrum(audio_signal)
    return {
        "incidentId": incident_id,
        "acousticFreq": freq,
        **analysis
    }
