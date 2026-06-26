import { useState, useEffect, useCallback } from 'react';
import { Supplier } from '@/types';
import { SupplierService } from '@/services/supplier.service';
import toast from 'react-hot-toast';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupplierService.getAll();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suppliers');
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const createSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      const newSupplier = await SupplierService.create(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
      toast.success('Supplier created successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create supplier');
      return false;
    }
  };

  const updateSupplier = async (id: number | string, supplierData: Partial<Supplier>) => {
    try {
      const updatedSupplier = await SupplierService.update(id, supplierData);
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
      toast.success('Supplier updated successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update supplier');
      return false;
    }
  };

  const deleteSupplier = async (id: number | string) => {
    try {
      await SupplierService.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      toast.success('Supplier deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete supplier');
      return false;
    }
  };

  const updateRating = async (id: number | string, rating: number) => {
    try {
      await SupplierService.updateRating(id, rating);
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, rating } : s));
      toast.success('Rating updated');
      return true;
    } catch (err: any) {
      toast.error('Failed to update rating');
      return false;
    }
  };

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    updateRating
  };
};
