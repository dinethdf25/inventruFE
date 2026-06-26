import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/types';
import { LocationService } from '@/services/location.service';
import toast from 'react-hot-toast';

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LocationService.getAll();
      setLocations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locations');
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (locationData: Partial<Location>) => {
    try {
      const newLocation = await LocationService.create(locationData);
      setLocations(prev => [...prev, newLocation]);
      toast.success('Location created successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create location');
      return false;
    }
  };

  const assignBatch = async (batchId: number | string, locationId: number | string, quantity: number) => {
    try {
      await LocationService.assignBatch(batchId, locationId, quantity);
      toast.success('Batch assigned to location');
      return true;
    } catch (err: any) {
      toast.error('Failed to assign batch');
      return false;
    }
  };

  const moveBatch = async (batchId: number | string, fromLocationId: number | string, toLocationId: number | string, quantity: number) => {
    try {
      await LocationService.moveBatch(batchId, fromLocationId, toLocationId, quantity);
      toast.success('Batch moved successfully');
      return true;
    } catch (err: any) {
      toast.error('Failed to move batch');
      return false;
    }
  };

  return {
    locations,
    loading,
    error,
    refetch: fetchLocations,
    createLocation,
    assignBatch,
    moveBatch
  };
};
