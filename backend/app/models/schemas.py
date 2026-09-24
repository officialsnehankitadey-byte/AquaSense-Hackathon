from pydantic import BaseModel, Field
from typing import Optional, List, Literal

SeverityLevel = Literal['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
IncidentStatus = Literal[
    'UNASSIGNED', 
    'ACKNOWLEDGED', 
    'INVESTIGATING', 
    'DISPATCHED', 
    'REPAIR_IN_PROGRESS', 
    'REPAIRED', 
    'RESOLVED'
]
DispatchStatus = Literal['PENDING', 'DISPATCHED', 'COMPLETED']

class KPIMetric(BaseModel):
    id: str
    title: str
    value: str
    unit: Optional[str] = None
    change: str
    changeType: Literal['positive', 'negative', 'neutral']
    secondaryInfo: str
    icon: str

class Incident(BaseModel):
    id: str
    code: str
    location: str
    dmaZone: str
    severity: SeverityLevel
    confidence: float
    estimatedLossGpm: float
    estimatedDailyCost: float
    detectedTime: str
    status: IncidentStatus
    pipeType: str
    pipeDiameter: str
    acousticFreq: float
    pressureDropPsi: float
    assignedCrew: Optional[str] = None
    summary: str
    repairPriority: Optional[int] = None
    recommendedAction: Optional[str] = None
    suspectedSegment: Optional[str] = None

class NetworkNode(BaseModel):
    id: str
    name: str
    type: Literal['PUMP_STATION', 'VALVE', 'ACOUSTIC_SENSOR', 'PRESSURE_SENSOR', 'RESERVOIR', 'LEAK_SPOT']
    x: float
    y: float
    status: Literal['OPTIMAL', 'WARNING', 'CRITICAL', 'OFFLINE']
    pressurePsi: float
    flowGpm: float
    zone: str
    batteryLevel: Optional[float] = None
    lastPing: Optional[str] = None

class PipeSegment(BaseModel):
    id: str
    fromNodeId: str
    toNodeId: str
    status: Literal['NORMAL', 'HIGH_PRESSURE', 'LEAK_DETECTED', 'MAINTENANCE']
    flowDirection: Literal['FORWARD', 'REVERSE']
    diameterInches: float
    lengthMeters: float
    flowRateGpm: float

class RepairPriorityItem(BaseModel):
    id: str
    incidentId: str
    incidentCode: Optional[str] = None
    dmaZone: Optional[str] = None
    confidence: Optional[float] = None
    estimatedLossGpm: Optional[float] = None
    rank: int
    location: str
    severity: SeverityLevel
    economicLossPerDay: float
    aiRecommendation: str
    structuralRiskScore: float
    estimatedRepairHours: float
    roiDays: float
    targetValveToIsolate: str
    dispatchStatus: Optional[DispatchStatus] = 'PENDING'

class RepairVerification(BaseModel):
    id: str
    incidentCode: str
    location: str
    dmaZone: str
    pipeType: str
    pipeDiameter: str
    repairedAt: str
    repairDuration: str
    verificationConfidence: float
    status: Literal['VERIFIED_REPAIRED'] = 'VERIFIED_REPAIRED'
    waterSavedLitersPerDay: float
    waterLossReductionPercent: float
    beforePressurePsi: float
    afterPressurePsi: float
    beforeFlowGpm: float
    afterFlowGpm: float
    beforeAcousticNoiseDb: float
    afterAcousticNoiseDb: float
    summary: str

class DMAZone(BaseModel):
    id: str
    name: str
    totalSensors: int
    activeLeaks: int
    avgPressurePsi: float
    waterLossRate: float

class PRVAdjustmentRequest(BaseModel):
    nodeId: str
    targetPressurePsi: float

class DispatchCrewRequest(BaseModel):
    incidentId: str
    crewName: str

class SpectrumAnalysisResult(BaseModel):
    sensorId: str
    frequencies: List[float]
    magnitudes: List[float]
    peakFrequencyHz: float
    leakProbability: float
    isLeakDetected: bool
