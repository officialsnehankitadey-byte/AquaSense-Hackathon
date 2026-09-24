import os
import csv
import yaml
import time
import math
from typing import Dict, List, Any

class SCADATelemetrySimulator:
    def __init__(self):
        self.is_running = True
        self.scada_dir = self._resolve_scada_dir()
        self.nodes_state: Dict[str, Dict[str, Any]] = {}
        self.pressure_sensors: List[str] = []
        self.flow_sensors: List[str] = []
        self.leak_links: List[Dict[str, Any]] = []
        self.pressure_history: List[Dict[str, float]] = []
        self.flow_history: List[Dict[str, float]] = []
        self.timestamps: List[str] = []
        self.coords: Dict[str, tuple[float, float]] = {}
        self.row_index = 0
        self.burst_active = False
        self.prv_adjustments: Dict[str, float] = {}

        self._load_network_inp()
        self._load_yaml_config()
        self._load_scada_csvs()
        self._init_nodes_state()

    def _resolve_scada_dir(self) -> str:
        candidates = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "scada")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "backend", "data", "scada")),
            os.path.abspath("data/scada"),
            os.path.abspath("backend/data/scada")
        ]
        for path in candidates:
            if os.path.exists(path):
                return path
        return candidates[0]

    def _load_network_inp(self):
        inp_path = os.path.join(self.scada_dir, "L-TOWN.inp")
        if not os.path.exists(inp_path):
            return

        with open(inp_path, "r") as f:
            lines = f.readlines()

        in_coord = False
        raw_coords = {}
        for line in lines:
            line_str = line.strip()
            if line_str.startswith("[COORDINATES]"):
                in_coord = True
                continue
            elif line_str.startswith("[") and in_coord:
                break
            if in_coord and line_str and not line_str.startswith(";"):
                parts = line_str.split()
                if len(parts) >= 3:
                    raw_coords[parts[0]] = (float(parts[1]), float(parts[2]))

        if raw_coords:
            xs = [c[0] for c in raw_coords.values()]
            ys = [c[1] for c in raw_coords.values()]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            range_x = max(1.0, max_x - min_x)
            range_y = max(1.0, max_y - min_y)

            # Normalize coordinates to 8% - 92% canvas grid
            for node_id, (x, y) in raw_coords.items():
                norm_x = round(8.0 + ((x - min_x) / range_x) * 84.0, 1)
                norm_y = round(92.0 - ((y - min_y) / range_y) * 84.0, 1) # Flip Y for standard screen coordinates
                self.coords[node_id] = (norm_x, norm_y)

    def _load_yaml_config(self):
        config_path = os.path.join(self.scada_dir, "dataset_configuration.yaml")
        if os.path.exists(config_path):
            try:
                with open(config_path, "r") as f:
                    config = yaml.safe_load(f) or {}
                self.pressure_sensors = config.get("pressure_sensors", [])
                self.flow_sensors = config.get("flow_sensors", [])
                self.leak_links = config.get("leakages", [])
            except Exception:
                pass

    def _load_scada_csvs(self):
        p_path = os.path.join(self.scada_dir, "2018_SCADA_Pressures.csv")
        f_path = os.path.join(self.scada_dir, "2018_SCADA_Flows.csv")

        # Load pressure CSV rows (load up to 5,000 timesteps for high performance memory buffer)
        if os.path.exists(p_path):
            with open(p_path, "r") as f:
                reader = csv.reader(f, delimiter=";")
                header = next(reader, None)
                if header:
                    cols = header[1:]
                    if not self.pressure_sensors:
                        self.pressure_sensors = cols
                    for idx, row in enumerate(reader):
                        if idx >= 4000:
                            break
                        if len(row) > 1:
                            self.timestamps.append(row[0])
                            row_dict = {}
                            for c_idx, sensor_name in enumerate(cols):
                                try:
                                    # Convert bar/m pressure to PSI (1 m H2O = 1.422 PSI)
                                    val_m = float(row[c_idx + 1].replace(",", "."))
                                    row_dict[sensor_name] = round(val_m * 1.422, 1)
                                except (ValueError, IndexError):
                                    row_dict[sensor_name] = 50.0
                            self.pressure_history.append(row_dict)

        # Load flow CSV rows
        if os.path.exists(f_path):
            with open(f_path, "r") as f:
                reader = csv.reader(f, delimiter=";")
                header = next(reader, None)
                if header:
                    cols = header[1:]
                    for idx, row in enumerate(reader):
                        if idx >= 4000:
                            break
                        if len(row) > 1:
                            row_dict = {}
                            for c_idx, sensor_name in enumerate(cols):
                                try:
                                    # Flow rate in L/s converted to GPM (1 L/s = 15.85 GPM)
                                    val_ls = float(row[c_idx + 1].replace(",", "."))
                                    row_dict[sensor_name] = round(val_ls * 15.85, 1)
                                except (ValueError, IndexError):
                                    row_dict[sensor_name] = 450.0
                            self.flow_history.append(row_dict)

    def _get_dma_for_node(self, node_id: str) -> str:
        try:
            num = int(node_id.lstrip("n"))
            if num <= 260:
                return "DMA-01 North Ridge Reservoir"
            elif num <= 520:
                return "DMA-02 Downtown Commercial Core"
            else:
                return "DMA-03 Industrial District East"
        except Exception:
            return "DMA-01 North Ridge Reservoir"

    def _init_nodes_state(self):
        # Create full telemetry state map from real dataset sensors
        sensor_list = self.pressure_sensors if self.pressure_sensors else ["n1", "n4", "n31", "n54", "n105", "n114", "n163", "n188", "n215", "n229", "n288", "n296", "n332", "n342", "n410", "n415", "n429", "n458", "n469", "n495", "n506", "n516", "n519", "n549", "n613", "n636", "n644", "n679", "n722", "n726", "n740", "n752", "n769"]
        
        # Include key network infrastructure nodes
        special_nodes = {
            "n1": ("Main Reservoir Feed Node R-1", "RESERVOIR"),
            "n4": ("Booster Pump Station P-101", "PUMP_STATION"),
            "n31": ("Hydrophone Acoustic AS-109", "ACOUSTIC_SENSOR"),
            "n105": ("Pressure Reducing Valve PRV-12", "VALVE"),
            "n679": ("Acoustic Sensor AS-402 (L-TOWN Burst Site)", "LEAK_SPOT"),
            "n769": ("District Pressure Sensor PS-301", "PRESSURE_SENSOR")
        }

        for idx, s_id in enumerate(sensor_list):
            name, node_type = special_nodes.get(s_id, (f"Pressure Sensor Node {s_id}", "PRESSURE_SENSOR"))
            x, y = self.coords.get(s_id, (10 + (idx * 2.5) % 80, 20 + (idx * 3) % 70))
            dma = self._get_dma_for_node(s_id)
            
            self.nodes_state[s_id] = {
                "id": s_id,
                "name": name,
                "type": node_type,
                "x": x,
                "y": y,
                "status": "OPTIMAL",
                "pressurePsi": 62.5,
                "flowGpm": 450.0,
                "zone": dma,
                "batteryLevel": 90 + (idx % 10)
            }

        # Aliases for frontend legacy references (node-1 .. node-6)
        legacy_aliases = [
            ("node-1", "n1"),
            ("node-2", "n4"),
            ("node-3", "n31"),
            ("node-4", "n105"),
            ("node-5", "n679"),
            ("node-6", "n769")
        ]
        for alias, target in legacy_aliases:
            if target in self.nodes_state:
                self.nodes_state[alias] = self.nodes_state[target]

    def trigger_burst(self):
        self.burst_active = True
        if "n679" in self.nodes_state:
            self.nodes_state["n679"]["status"] = "CRITICAL"
            self.nodes_state["n679"]["pressurePsi"] = 24.1
            self.nodes_state["n679"]["flowGpm"] = 780.0
        if "node-5" in self.nodes_state:
            self.nodes_state["node-5"]["status"] = "CRITICAL"
            self.nodes_state["node-5"]["pressurePsi"] = 24.1
            self.nodes_state["node-5"]["flowGpm"] = 780.0

    def reset_simulation(self):
        self.burst_active = False
        if "n679" in self.nodes_state:
            self.nodes_state["n679"]["status"] = "CRITICAL"
            self.nodes_state["n679"]["pressurePsi"] = 38.5
            self.nodes_state["n679"]["flowGpm"] = 420.0
        if "node-5" in self.nodes_state:
            self.nodes_state["node-5"]["status"] = "CRITICAL"
            self.nodes_state["node-5"]["pressurePsi"] = 38.5
            self.nodes_state["node-5"]["flowGpm"] = 420.0

    def tick(self) -> List[Dict[str, Any]]:
        if not self.pressure_history:
            return list(self.nodes_state.values())

        p_row = self.pressure_history[self.row_index % len(self.pressure_history)]
        f_row = self.flow_history[self.row_index % len(self.flow_history)] if self.flow_history else {}
        
        self.row_index = (self.row_index + 1) % len(self.pressure_history)

        updated_nodes = []
        base_flow = f_row.get("PUMP_1", 450.0)

        for s_id, data in self.nodes_state.items():
            if s_id.startswith("node-"): # Skip duplicate alias processing
                continue
                
            real_p = p_row.get(s_id, data["pressurePsi"])
            
            # Apply PRV setpoint adjustment if present
            if s_id in self.prv_adjustments:
                real_p = self.prv_adjustments[s_id]

            if s_id == "n679" and self.burst_active:
                real_p = 24.1
                node_flow = 780.0
                status = "CRITICAL"
            elif real_p < 40.0:
                node_flow = round(base_flow * 0.7, 1)
                status = "WARNING" if real_p > 30.0 else "CRITICAL"
            else:
                node_flow = round(base_flow * (0.8 + (hash(s_id) % 30) / 100.0), 1)
                status = "OPTIMAL"

            data["pressurePsi"] = round(float(real_p), 1)
            data["flowGpm"] = round(float(node_flow), 1)
            data["status"] = status
            data["lastPing"] = "Live SCADA"

            updated_nodes.append(data.copy())

        # Ensure legacy aliases inherit updated sensor values
        legacy_aliases = [("node-1", "n1"), ("node-2", "n4"), ("node-3", "n31"), ("node-4", "n105"), ("node-5", "n679"), ("node-6", "n769")]
        for alias, target in legacy_aliases:
            if target in self.nodes_state and alias in self.nodes_state:
                self.nodes_state[alias] = self.nodes_state[target].copy()
                self.nodes_state[alias]["id"] = alias

        return updated_nodes

    def get_dma_zones(self) -> List[Dict[str, Any]]:
        nodes = list(self.nodes_state.values())
        dma_map = {
            "all": {"id": "all", "name": "All Networks (L-TOWN Grid)", "totalSensors": len(nodes), "activeLeaks": 4, "pressures": [], "waterLossRate": 4.2},
            "dma-01": {"id": "dma-01", "name": "DMA-01 North Ridge Reservoir", "totalSensors": 0, "activeLeaks": 1, "pressures": [], "waterLossRate": 5.1},
            "dma-02": {"id": "dma-02", "name": "DMA-02 Downtown Commercial Core", "totalSensors": 0, "activeLeaks": 1, "pressures": [], "waterLossRate": 2.8},
            "dma-03": {"id": "dma-03", "name": "DMA-03 Industrial District East", "totalSensors": 0, "activeLeaks": 2, "pressures": [], "waterLossRate": 7.4}
        }

        for n in nodes:
            if n["id"].startswith("node-"): continue
            p = n.get("pressurePsi", 60.0)
            dma_map["all"]["pressures"].append(p)
            z = n.get("zone", "")
            if "DMA-01" in z:
                dma_map["dma-01"]["totalSensors"] += 1
                dma_map["dma-01"]["pressures"].append(p)
            elif "DMA-02" in z:
                dma_map["dma-02"]["totalSensors"] += 1
                dma_map["dma-02"]["pressures"].append(p)
            elif "DMA-03" in z:
                dma_map["dma-03"]["totalSensors"] += 1
                dma_map["dma-03"]["pressures"].append(p)

        res = []
        for key, zone in dma_map.items():
            avg_p = round(sum(zone["pressures"]) / max(1, len(zone["pressures"])), 1) if zone["pressures"] else 64.0
            res.append({
                "id": zone["id"],
                "name": zone["name"],
                "totalSensors": zone["totalSensors"],
                "activeLeaks": zone["activeLeaks"],
                "avgPressurePsi": avg_p,
                "waterLossRate": zone["waterLossRate"]
            })
        return res

    def get_kpis(self) -> List[Dict[str, Any]]:
        nodes = [n for n in self.nodes_state.values() if not n["id"].startswith("node-")]
        avg_pressure = sum(n["pressurePsi"] for n in nodes) / max(1, len(nodes))
        optimal_count = sum(1 for n in nodes if n["status"] == "OPTIMAL")
        health = round((optimal_count / max(1, len(nodes))) * 100.0, 1)

        return [
            {
                "id": "kpi-1",
                "title": "Network Health Index",
                "value": f"{health}%",
                "change": "+2.4%",
                "changeType": "positive",
                "secondaryInfo": f"Real L-TOWN SCADA Telemetry across 3 DMAs (Avg {avg_pressure:.1f} PSI)",
                "icon": "Activity",
            },
            {
                "id": "kpi-2",
                "title": "SCADA Sensors Online",
                "value": f"{len(nodes)}",
                "unit": "/ 33",
                "change": "100%",
                "changeType": "positive",
                "secondaryInfo": "33 Pressure Sensors & 3 Flow Meters Active",
                "icon": "Radio",
            },
            {
                "id": "kpi-3",
                "title": "Active Incidents",
                "value": "4",
                "change": "-2 from baseline",
                "changeType": "positive",
                "secondaryInfo": "1 Critical Burst • 2 High • 1 Medium",
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

simulator = SCADATelemetrySimulator()
