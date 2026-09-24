from typing import List, Dict, Any
from app.models.schemas import RepairPriorityItem, Incident

class AIRepairOptimizer:
    def compute_sinkhole_risk(self, pressure_drop_psi: float, estimated_loss_gpm: float, pipe_type: str) -> float:
        # Base risk from pressure drop and loss rate
        loss_factor = min(40.0, (estimated_loss_gpm / 150.0) * 40.0)
        drop_factor = min(40.0, (pressure_drop_psi / 20.0) * 40.0)
        
        # Pipe type vulnerability (Cast iron / Ductile iron higher risk of catastrophic erosion)
        pipe_multiplier = 1.2 if 'Iron' in pipe_type else 1.0
        
        risk_score = (loss_factor + drop_factor) * pipe_multiplier
        return min(98.5, round(risk_score, 1))

    def calculate_priorities(self, incidents: List[Incident]) -> List[RepairPriorityItem]:
        items = []
        for inc in incidents:
            if inc.status in ['REPAIRED', 'RESOLVED']:
                continue
                
            risk_score = self.compute_sinkhole_risk(
                inc.pressureDropPsi, inc.estimatedLossGpm, inc.pipeType
            )
            
            # ROI calculation (Assuming repair cost ~$2,500)
            daily_loss = inc.estimatedDailyCost
            roi_days = round(2500.0 / max(1.0, daily_loss), 1)
            
            # Ranking weight: 50% Daily Cost + 50% Structural Sinkhole Risk
            weighted_score = (daily_loss / 20.0) + (risk_score * 2.0)
            
            items.append({
                'item': RepairPriorityItem(
                    id=f"rep-{inc.id}",
                    incidentId=inc.id,
                    incidentCode=inc.code,
                    dmaZone=inc.dmaZone,
                    confidence=inc.confidence,
                    estimatedLossGpm=inc.estimatedLossGpm,
                    rank=1, # Updated after sort
                    location=inc.location,
                    severity=inc.severity,
                    economicLossPerDay=daily_loss,
                    aiRecommendation=inc.recommendedAction or f"Isolate leak segment and dispatch repair crew immediately.",
                    structuralRiskScore=risk_score,
                    estimatedRepairHours=round(max(2.0, inc.estimatedLossGpm / 25.0), 1),
                    roiDays=roi_days,
                    targetValveToIsolate=inc.suspectedSegment or "Valve PRV-12",
                    dispatchStatus="DISPATCHED" if inc.assignedCrew else "PENDING"
                ),
                'score': weighted_score
            })
            
        # Sort by weighted priority score descending
        items.sort(key=lambda x: x['score'], reverse=True)
        
        # Assign ranks
        sorted_priorities = []
        for idx, entry in enumerate(items, start=1):
            p = entry['item']
            p.rank = idx
            sorted_priorities.append(p)
            
        return sorted_priorities

repair_optimizer = AIRepairOptimizer()
