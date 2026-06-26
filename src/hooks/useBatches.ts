import { useState, useEffect, useCallback } from 'react';
import { Batch } from '@/types';
import { BatchService } from '@/services/batch.service';
import { API } from '@/constants/api.constants';
import apiClient from '@/config/axios.config';
import toast from 'react-hot-toast';

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Trying to fetch all batches. If backend strictly requires productId, we'd need to loop over products.
      // For now, assuming GET /batches works, or we can use getExpiringSoon as a proxy if it fails.
      // Let's use getExpiringSoon(365) to get all batches expiring in the next year if GET /batches fails?
      // No, we'll try GET /batches first.
      const { data } = await apiClient.get(API.BATCHES.BASE);
      
      // Implement FEFO sort (First Expired First Out) automatically
      const sorted = [...data].sort((a, b) => {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      });
      
      setBatches(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch batches');
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const createBatch = async (batchData: Partial<Batch>) => {
    try {
      const newBatch = await BatchService.create(batchData);
      
      setBatches(prev => {
        const updated = [...prev, newBatch];
        // Re-sort using FEFO
        return updated.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      });
      
      toast.success('Batch added successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add batch');
      return false;
    }
  };

  const spoilBatch = async (id: string) => {
    try {
      await BatchService.spoil(id);
      setBatches(prev => prev.map(b => b.id === id ? { ...b, status: 'EXPIRED' } : b));
      toast.success('Batch marked as spoiled');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to spoil batch');
      return false;
    }
  };

  const recallBatch = async (id: string) => {
    try {
      await BatchService.recall(id);
      setBatches(prev => prev.filter(b => b.id !== id));
      toast.success('Batch recalled successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to recall batch');
      return false;
    }
  };

  return {
    batches,
    loading,
    error,
    refetch: fetchBatches,
    createBatch,
    spoilBatch,
    recallBatch
  };
};
