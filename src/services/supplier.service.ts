import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { Supplier } from '@/types';

export const SupplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await apiClient.get(API.SUPPLIERS.BASE);
    return data;
  },
  getById: async (id: number | string): Promise<Supplier> => {
    const { data } = await apiClient.get(API.SUPPLIERS.BY_ID(id));
    return data;
  },
  create: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await apiClient.post(API.SUPPLIERS.BASE, supplier);
    return data;
  },
  update: async (id: number | string, supplier: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await apiClient.put(API.SUPPLIERS.BY_ID(id), supplier);
    return data;
  },
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(API.SUPPLIERS.BY_ID(id));
  },
  updateRating: async (id: number | string, rating: number): Promise<void> => {
    await apiClient.put(API.SUPPLIERS.RATING(id), { rating });
  },
  assignProduct: async (supplierId: number | string, productId: string): Promise<void> => {
    await apiClient.post(API.SUPPLIERS.ASSIGN_PRODUCT, { supplierId, productId });
  },
  getProducts: async (id: number | string): Promise<any[]> => {
    const { data } = await apiClient.get(API.SUPPLIERS.PRODUCTS(id));
    return data;
  },
  getBestSupplier: async (productId: string): Promise<Supplier> => {
    const { data } = await apiClient.get(API.SUPPLIERS.BEST(productId));
    return data;
  },
  getCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.SUPPLIERS.COUNT);
    return data;
  }
};
