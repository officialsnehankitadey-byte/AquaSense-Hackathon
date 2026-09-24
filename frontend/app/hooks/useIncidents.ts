import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { Incident, IncidentStatus } from '../types/dashboard';

export function useIncidents(selectedZone: string = 'all', searchQuery: string = '') {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    const data = await apiService.getIncidents();
    setIncidents(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const updateStatus = async (incidentId: string, status: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, status } : inc))
    );
    await apiService.updateIncidentStatus(incidentId, status);
  };

  const dispatchCrew = async (incidentId: string, crewName: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, status: 'DISPATCHED', assignedCrew: crewName } : inc))
    );
    await apiService.dispatchCrew(incidentId, crewName);
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = 
      inc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.dmaZone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesZone = selectedZone === 'all' || inc.dmaZone.toLowerCase().includes(selectedZone.toLowerCase());

    return matchesSearch && matchesZone;
  });

  return {
    incidents: filteredIncidents,
    allIncidents: incidents,
    isLoading,
    updateStatus,
    dispatchCrew,
    refreshIncidents: loadIncidents
  };
}
