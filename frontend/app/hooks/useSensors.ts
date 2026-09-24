import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { NetworkNode, PipeSegment } from '../types/dashboard';

export function useSensors(selectedZone: string = 'all') {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [pipes, setPipes] = useState<PipeSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiService.getNetworkNodes(), apiService.getPipeSegments()]).then(
      ([nodesData, pipesData]) => {
        setNodes(nodesData);
        setPipes(pipesData);
        setIsLoading(false);
      }
    );
  }, []);

  const updatePRV = async (nodeId: string, setpointPsi: number) => {
    setNodes(prev =>
      prev.map(node => (node.id === nodeId ? { ...node, pressurePsi: setpointPsi } : node))
    );
    await apiService.setPRVPressure(nodeId, setpointPsi);
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
    updatePRV
  };
}
