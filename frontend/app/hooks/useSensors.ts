import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { telemetryWS, TelemetryData } from '../services/websocket';
import { NetworkNode, PipeSegment } from '../types/dashboard';

export function useSensors(selectedZone: string = 'all') {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [pipes, setPipes] = useState<PipeSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNodesAndPipes = async () => {
    const [nodesData, pipesData] = await Promise.all([
      apiService.getNetworkNodes(),
      apiService.getPipeSegments()
    ]);
    if (nodesData && nodesData.length > 0) {
      setNodes(nodesData);
    }
    if (pipesData && pipesData.length > 0) {
      setPipes(pipesData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNodesAndPipes();

    // Subscribe to live WebSocket nodes stream
    const unsubscribe = telemetryWS.subscribe((data: TelemetryData) => {
      if (data.nodes && data.nodes.length > 0) {
        setNodes(data.nodes);
        setIsLoading(false);
      }
    });

    // Fallback polling every 2 seconds
    const intervalId = setInterval(() => {
      apiService.getNetworkNodes().then(liveNodes => {
        if (liveNodes && liveNodes.length > 0) {
          setNodes(liveNodes);
        }
      });
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const updatePRV = async (nodeId: string, setpointPsi: number) => {
    setNodes(prev =>
      prev.map(node => (node.id === nodeId ? { ...node, pressurePsi: setpointPsi } : node))
    );
    await apiService.setPRVPressure(nodeId, setpointPsi);
    fetchNodesAndPipes();
  };

  const filteredNodes = nodes.filter(node => {
    if (selectedZone === 'all') return true;
    return node.zone.toLowerCase().includes(selectedZone.toLowerCase());
  });

  return {
    nodes: filteredNodes,
    allNodes: nodes,
    pipes,
    isLoading,
    updatePRV,
    refreshSensors: fetchNodesAndPipes
  };
}
