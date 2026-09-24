from fastapi import APIRouter, Depends
from typing import List
from app.models.schemas import KPIMetric, NetworkNode, PipeSegment, DMAZone
from app.simulator.telemetry_generator import simulator

router = APIRouter(prefix="/api/telemetry", tags=["Telemetry"])

@router.get("/kpis", response_model=List[KPIMetric])
def get_kpis():
    return [
        {
            "id": "kpi-1",
            "title": "Network Health Index",
            "value": "94.2%",
            "change": "+1.8%",
            "changeType": "positive",
            "secondaryInfo": "Optimal operating state across 6 DMAs",
            "icon": "Activity",
        },
        {
            "id": "kpi-2",
            "title": "Sensors Online",
            "value": "1,482",
            "unit": "/ 1,500",
            "change": "98.8%",
            "changeType": "positive",
            "secondaryInfo": "18 sensors undergoing scheduled sync",
            "icon": "Radio",
        },
        {
            "id": "kpi-3",
            "title": "Active Incidents",
            "value": "4",
            "change": "-2 from yesterday",
            "changeType": "positive",
            "secondaryInfo": "1 Critical • 2 High • 1 Medium",
            "icon": "AlertTriangle",
        },
        {
            "id": "kpi-4",
            "title": "Water Saved (30d)",
            "value": "4.82M",
            "unit": "Liters",
            "change": "+$42,500",
            "changeType": "positive",
            "secondaryInfo": "NRW loss reduced by 31.4% this month",
            "icon": "Droplets",
        },
    ]

@router.get("/nodes", response_model=List[NetworkNode])
def get_nodes():
    return simulator.tick()

@router.get("/dma-zones", response_model=List[DMAZone])
def get_dma_zones():
    return [
        {"id": "all", "name": "All Networks (Metro Area)", "totalSensors": 1500, "activeLeaks": 4, "avgPressurePsi": 64.5, "waterLossRate": 4.2},
        {"id": "dma-01", "name": "DMA-01 North Ridge Reservoir", "totalSensors": 240, "activeLeaks": 1, "avgPressurePsi": 68.2, "waterLossRate": 5.1},
        {"id": "dma-02", "name": "DMA-02 Downtown Commercial Core", "totalSensors": 380, "activeLeaks": 0, "avgPressurePsi": 62.0, "waterLossRate": 2.1},
        {"id": "dma-03", "name": "DMA-03 Industrial District East", "totalSensors": 310, "activeLeaks": 2, "avgPressurePsi": 71.4, "waterLossRate": 7.8},
        {"id": "dma-04", "name": "DMA-04 Westside Residential", "totalSensors": 290, "activeLeaks": 1, "avgPressurePsi": 59.8, "waterLossRate": 3.9},
        {"id": "dma-05", "name": "DMA-05 South Port Feed", "totalSensors": 280, "activeLeaks": 0, "avgPressurePsi": 61.5, "waterLossRate": 1.8},
    ]
