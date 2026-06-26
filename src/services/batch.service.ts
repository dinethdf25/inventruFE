import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { Batch } from '@/types';

export const BatchService = {
  // We rename getAll to getByProduct since the real endpoint is product-scoped
  getByProduct: async (productId: string): Promise<Batch[]> => {
    const { data } = await apiClient.get(API.BATCHES.BY_PRODUCT(productId));
    return data;
  },
  getById: async (id: string): Promise<Batch> => {
    const { data } = await apiClient.get(API.BATCHES.BY_ID(id));
    return data;
  },
  create: async (batch: Partial<Batch>): Promise<Batch> => {
    const { data } = await apiClient.post(API.BATCHES.BASE, batch);
    return data;
  },
  allocate: async (productId: string, quantity: number): Promise<void> => {
    await apiClient.post(API.BATCHES.ALLOCATE, { productId, quantity });
  },
  reduce: async (id: string, soldQuantity: number): Promise<void> => {
    await apiClient.post(API.BATCHES.REDUCE(id), { soldQuantity });
  },
  spoil: async (id: string): Promise<void> => {
    await apiClient.put(API.BATCHES.SPOIL(id));
  },
  recall: async (id: string): Promise<void> => {
    await apiClient.put(API.BATCHES.RECALL(id));
  },
  getExpiringSoon: async (days: number): Promise<Batch[]> => {
    const { data } = await apiClient.get(`${API.BATCHES.EXPIRING_SOON}?days=${days}`);
    return data;
  },
  getCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.BATCHES.COUNT);
    return data;
  },
  getExpiringCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.BATCHES.EXPIRING_COUNT);
    return data;
  },
};
