from fastapi import APIRouter
from typing import List
from app.models.schemas import RepairPriorityItem, RepairVerification
from app.api.routers.incidents import INCIDENTS_DB
from app.ai.repair_optimizer import repair_optimizer

router = APIRouter(prefix="/api/repairs", tags=["Repair Queue & AI Prioritization"])

REPAIR_VERIFICATIONS_DB: List[RepairVerification] = [
    RepairVerification(
        id="ver-901",
        incidentCode="LEAK-2026-861",
        location="Sector 2 Main Connector (14th St & Vine)",
        dmaZone="DMA-02 Downtown Commercial Core",
        pipeType="Ductile Iron",
        pipeDiameter="16 in",
        repairedAt="Yesterday 14:30",
        repairDuration="4.5 hrs",
        verificationConfidence=99.4,
        status="VERIFIED_REPAIRED",
        waterSavedLitersPerDay=245000,
        waterLossReductionPercent=98.2,
        beforePressurePsi=42.1,
        afterPressurePsi=64.8,
        beforeFlowGpm=920,
        afterFlowGpm=610,
        beforeAcousticNoiseDb=74.2,
        afterAcousticNoiseDb=18.5,
        summary="Stainless steel repair clamp installed over circumferential crack. Pressure fully restored to 64.8 PSI baseline.",
    )
]

@router.get("/priorities", response_model=List[RepairPriorityItem])
def get_repair_priorities():
    return repair_optimizer.calculate_priorities(INCIDENTS_DB)

@router.get("/verifications", response_model=List[RepairVerification])
def get_repair_verifications():
    return REPAIR_VERIFICATIONS_DB
