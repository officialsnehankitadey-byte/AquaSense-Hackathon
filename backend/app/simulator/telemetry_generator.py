import asyncio
import random
import math
from typing import Dict, List, Any
import time

class SCADATelemetrySimulator:
    def __init__(self):
        self.is_running = False
        self.nodes_state: Dict[str, Dict[str, Any]] = {
            'node-1': {'id': 'node-1', 'name': 'Main Feed Reservoir R-1', 'type': 'RESERVOIR', 'x': 10, 'y': 25, 'status': 'OPTIMAL', 'pressurePsi': 85.0, 'flowGpm': 1420.0, 'zone': 'DMA-01', 'batteryLevel': 100},
            'node-2': {'id': 'node-2', 'name': 'Booster Pump Station P-101', 'type': 'PUMP_STATION', 'x': 25, 'y': 40, 'status': 'OPTIMAL', 'pressurePsi': 78.4, 'flowGpm': 1180.0, 'zone': 'DMA-01', 'batteryLevel': 98},
            'node-3': {'id': 'node-3', 'name': 'Hydrophone Acoustic AS-109', 'type': 'ACOUSTIC_SENSOR', 'x': 42, 'y': 30, 'status': 'WARNING', 'pressurePsi': 64.2, 'flowGpm': 850.0, 'zone': 'DMA-01', 'batteryLevel': 89},
            'node-4': {'id': 'node-4', 'name': 'Pressure Reducing Valve PRV-12', 'type': 'VALVE', 'x': 58, 'y': 55, 'status': 'OPTIMAL', 'pressurePsi': 52.0, 'flowGpm': 640.0, 'zone': 'DMA-03', 'batteryLevel': 94},
            'node-5': {'id': 'node-5', 'name': 'Acoustic Sensor AS-402 (Leak Site)', 'type': 'LEAK_SPOT', 'x': 74, 'y': 62, 'status': 'CRITICAL', 'pressurePsi': 38.5, 'flowGpm': 420.0, 'zone': 'DMA-03', 'batteryLevel': 76},
            'node-6': {'id': 'node-6', 'name': 'Pressure Sensor PS-301', 'type': 'PRESSURE_SENSOR', 'x': 88, 'y': 75, 'status': 'OPTIMAL', 'pressurePsi': 61.2, 'flowGpm': 310.0, 'zone': 'DMA-03', 'batteryLevel': 91},
        }
        self.burst_active = False

    def trigger_burst(self):
        self.burst_active = True
        self.nodes_state['node-5']['status'] = 'CRITICAL'
        self.nodes_state['node-5']['pressurePsi'] = 24.1
        self.nodes_state['node-5']['flowGpm'] = 680.0

    def reset_simulation(self):
        self.burst_active = False
        self.nodes_state['node-5']['status'] = 'CRITICAL'
        self.nodes_state['node-5']['pressurePsi'] = 38.5
        self.nodes_state['node-5']['flowGpm'] = 420.0

    def tick(self) -> List[Dict[str, Any]]:
        t = time.time()
        sine_offset = math.sin(t / 5.0) * 1.5
        noise = random.uniform(-0.4, 0.4)

        updated_nodes = []
        for node_id, data in self.nodes_state.items():
            base_pressure = data['pressurePsi']
            if node_id == 'node-5' and self.burst_active:
                current_pressure = max(18.0, base_pressure + noise * 1.5)
            else:
                current_pressure = max(10.0, round(base_pressure + sine_offset * 0.3 + noise, 1))

            current_flow = max(0.0, round(data['flowGpm'] + sine_offset * 10 + noise * 5, 1))
            
            node_copy = data.copy()
            node_copy['pressurePsi'] = current_pressure
            node_copy['flowGpm'] = current_flow
            node_copy['lastPing'] = 'Just now'
            updated_nodes.append(node_copy)
        
        return updated_nodes

simulator = SCADATelemetrySimulator()
