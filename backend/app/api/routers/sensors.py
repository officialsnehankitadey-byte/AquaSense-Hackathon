from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import PRVAdjustmentRequest
from app.simulator.telemetry_generator import simulator

router = APIRouter(prefix="/api/sensors", tags=["Sensors & PRV Control"])

@router.post("/prv/adjust")
def adjust_prv_pressure(request: PRVAdjustmentRequest):
    node_id = request.nodeId
    if node_id in simulator.nodes_state:
        simulator.nodes_state[node_id]['pressurePsi'] = request.targetPressurePsi
        return {
            "status": "SUCCESS",
            "message": f"Successfully updated setpoint for {simulator.nodes_state[node_id]['name']} to {request.targetPressurePsi} PSI",
            "updatedNode": simulator.nodes_state[node_id]
        }
    raise HTTPException(status_code=404, detail="Sensor node not found")

@router.post("/{node_id}/calibrate")
def calibrate_sensor(node_id: str):
    if node_id in simulator.nodes_state:
        simulator.nodes_state[node_id]['status'] = 'OPTIMAL'
        simulator.nodes_state[node_id]['lastPing'] = 'Calibrated just now'
        return {
            "status": "SUCCESS",
            "message": f"Sensor {node_id} calibrated successfully.",
            "node": simulator.nodes_state[node_id]
        }
    raise HTTPException(status_code=404, detail="Sensor not found")
