from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Incident, DispatchCrewRequest
from app.ai.fft_processor import fft_processor

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

# Real L-TOWN dataset incidents mapped with acoustic WAV recordings
INCIDENTS_DB: List[Incident] = [
    Incident(
        id="inc-101",
        code="LEAK-LTOWN-p673",
        location="Sector 3 - Pipe p673 (Node n679 → Node n680)",
        dmaZone="DMA-03 Industrial District East",
        severity="CRITICAL",
        confidence=98.5,
        estimatedLossGpm=185,
        estimatedDailyCost=2150,
        detectedTime="14 mins ago",
        status="INVESTIGATING",
        pipeType="Ductile Iron",
        pipeDiameter="16 in",
        acousticFreq=340,
        pressureDropPsi=18.4,
        summary="Abrupt circumferential pipe fracture detected on L-TOWN link p673. High acoustic energy signature analyzed from hydrophone noise loggers.",
        repairPriority=1,
        suspectedSegment="Pipe Link #p673 (Node n679 → Node n680)",
        recommendedAction="Immediate isolation of PRV Valve at Node n679. Structural sinkhole risk elevated due to high discharge velocity.",
    ),
    Incident(
        id="inc-102",
        code="LEAK-LTOWN-p461",
        location="North Ridge Feed - Pipe p461 (Node n4 → Node n469)",
        dmaZone="DMA-01 North Ridge Reservoir",
        severity="HIGH",
        confidence=92.1,
        estimatedLossGpm=95,
        estimatedDailyCost=1100,
        detectedTime="1 hr ago",
        status="DISPATCHED",
        assignedCrew="Field Response Crew Alpha",
        pipeType="Cast Iron",
        pipeDiameter="12 in",
        acousticFreq=285,
        pressureDropPsi=9.2,
        summary="Incipient joint displacement leak on link p461 flagged by differential pressure sensors and noise logger correlation.",
        repairPriority=2,
        suspectedSegment="Pipe Link #p461 (Node n4 → Node n469)",
        recommendedAction="Crew Alpha dispatched for acoustic ground listening survey. Adjust upstream setpoint to 50 PSI during excavation.",
    ),
    Incident(
        id="inc-103",
        code="LEAK-LTOWN-p232",
        location="Commercial Loop - Pipe p232 (Node n229 → Node n235)",
        dmaZone="DMA-02 Downtown Commercial Core",
        severity="HIGH",
        confidence=86.4,
        estimatedLossGpm=58,
        estimatedDailyCost=680,
        detectedTime="3 hrs ago",
        status="ACKNOWLEDGED",
        pipeType="PVC Schedule 80",
        pipeDiameter="10 in",
        acousticFreq=510,
        pressureDropPsi=6.1,
        summary="Acoustic hydrophone spectral resonance anomaly in 500Hz-600Hz frequency band along link p232.",
        repairPriority=3,
        suspectedSegment="Pipe Link #p232 (Node n229 → Node n235)",
        recommendedAction="Schedule night-time acoustic correlation survey between 01:00 AM - 04:00 AM.",
    ),
    Incident(
        id="inc-104",
        code="LEAK-LTOWN-p810",
        location="Sub-DMA 3 Feed - Pipe p810 (Node n740 → Node n752)",
        dmaZone="DMA-03 Industrial District East",
        severity="MEDIUM",
        confidence=79.2,
        estimatedLossGpm=28,
        estimatedDailyCost=320,
        detectedTime="6 hrs ago",
        status="UNASSIGNED",
        pipeType="Steel Encased",
        pipeDiameter="8 in",
        acousticFreq=215,
        pressureDropPsi=3.8,
        summary="Gradual drift in Minimum Night Flow (MNF) baseline on link p810 detected by AMR meter analysis.",
        repairPriority=4,
        suspectedSegment="Pipe Link #p810 (Node n740 → Node n752)",
        recommendedAction="Monitor pressure drop trend over 24-hour cycle before dispatching repair crew.",
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
    incident_code = inc.code if inc else incident_id
    
    # Retrieve real WAV recording file from dataset
    wav_file = fft_processor.get_sample_leak_recording(incident_code)
    analysis = fft_processor.analyze_file(wav_file)
    
    return {
        "incidentId": incident_id,
        "incidentCode": incident_code,
        "recordingFile": wav_file,
        "acousticFreq": inc.acousticFreq if inc else analysis["peakFrequencyHz"],
        **analysis
    }
