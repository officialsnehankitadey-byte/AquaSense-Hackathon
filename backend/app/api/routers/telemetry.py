from fastapi import APIRouter
from typing import List
from app.models.schemas import KPIMetric, NetworkNode, PipeSegment, DMAZone
from app.simulator.telemetry_generator import simulator

router = APIRouter(prefix="/api/telemetry", tags=["Telemetry"])

@router.get("/kpis", response_model=List[KPIMetric])
def get_kpis():
    return simulator.get_kpis()

@router.get("/nodes", response_model=List[NetworkNode])
def get_nodes():
    return simulator.tick()

@router.get("/pipes", response_model=List[PipeSegment])
def get_pipes():
    return simulator.get_pipes()

@router.get("/dma-zones", response_model=List[DMAZone])
def get_dma_zones():
    return simulator.get_dma_zones()
