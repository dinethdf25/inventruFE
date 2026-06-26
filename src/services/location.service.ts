import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { Location } from '@/types';

export const LocationService = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await apiClient.get(API.LOCATIONS.BASE);
    return data;
  },
  getById: async (id: number | string): Promise<Location> => {
    const { data } = await apiClient.get(API.LOCATIONS.BY_ID(id));
    return data;
  },
  create: async (location: Partial<Location>): Promise<Location> => {
    const { data } = await apiClient.post(API.LOCATIONS.BASE, location);
    return data;
  },
  assignBatch: async (batchId: number | string, locationId: number | string, quantity: number): Promise<void> => {
    await apiClient.post(API.LOCATIONS.ASSIGN, { batchId, locationId, quantity });
  },
  moveBatch: async (batchId: number | string, fromLocationId: number | string, toLocationId: number | string, quantity: number): Promise<void> => {
    await apiClient.post(API.LOCATIONS.MOVE, { batchId, fromLocationId, toLocationId, quantity });
  },
  getInventory: async (id: number | string): Promise<any[]> => {
    const { data } = await apiClient.get(API.LOCATIONS.INVENTORY(id));
    return data;
  },
  getLocationsByBatch: async (batchId: number | string): Promise<any[]> => {
    const { data } = await apiClient.get(API.LOCATIONS.BY_BATCH(batchId));
    return data;
  },
  getCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.LOCATIONS.COUNT);
    return data;
  }
};
