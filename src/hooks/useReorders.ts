import { useState, useEffect, useCallback } from 'react';
import { ReorderService } from '@/services/reorder.service';
import { Reorder } from '@/types';
import toast from 'react-hot-toast';

export const useReorders = () => {
  const [reorders, setReorders] = useState<Reorder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReorders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ReorderService.getAll();
      // Sort by most recent first
      const sorted = [...data].sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setReorders(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reorders');
      toast.error('Failed to load reorders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReorders();
  }, [fetchReorders]);

  const createReorder = async (productId: string, quantity: number) => {
    try {
      const newReorder = await ReorderService.create(productId, quantity);
      setReorders(prev => [newReorder, ...prev]);
      toast.success('Reorder created successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create reorder');
      return false;
    }
  };

  const updateReorderStatus = async (id: string | number, status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED') => {
    try {
      const updated = await ReorderService.updateStatus(id, status);
      setReorders(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success(`Reorder marked as ${status.toLowerCase()}`);
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status');
      return false;
    }
  };

  return {
    reorders,
    loading,
    error,
    refetch: fetchReorders,
    createReorder,
    updateReorderStatus
  };
};
