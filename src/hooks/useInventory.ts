import { useState, useEffect, useCallback } from 'react';
import { InventoryAdjustment } from '@/types';
import { InventoryService } from '@/services/inventory.service';
import toast from 'react-hot-toast';

export const useInventory = () => {
  const [history, setHistory] = useState<InventoryAdjustment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await InventoryService.getHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory history');
      toast.error('Failed to load inventory history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const adjustStock = async (adjustment: Partial<InventoryAdjustment>) => {
    try {
      const newAdjustment = await InventoryService.adjust(adjustment);
      setHistory(prev => [newAdjustment, ...prev]);
      toast.success('Stock adjusted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to adjust stock');
      return false;
    }
  };

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
    adjustStock
  };
};
