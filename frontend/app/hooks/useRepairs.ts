import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { RepairPriorityItem, RepairVerification } from '../types/dashboard';

export function useRepairs() {
  const [priorities, setPriorities] = useState<RepairPriorityItem[]>([]);
  const [verifications, setVerifications] = useState<RepairVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getRepairPriorities(),
      apiService.getRepairVerifications(),
    ]).then(([prioritiesData, verificationsData]) => {
      setPriorities(prioritiesData);
      setVerifications(verificationsData);
      setIsLoading(false);
    });
  }, []);

  return {
    priorities,
    verifications,
    isLoading,
  };
}
