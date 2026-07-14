import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/composite/Modal';
import { Batch } from '@/types';
import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { Spinner } from '@/components/ui';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export interface BatchLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
}

interface BatchLocation {
  batchId: number;
  locationCode: string;
  locationId: number;
  quantity: number;
  section: string;
  shelf: string;
  warehouse: string;
}

// Normalize flat or nested API responses into a consistent BatchLocation shape
const normalize = (raw: any): BatchLocation => {
  // Nested: { quantity, batchId, location: { locationCode, warehouse, section, shelf, id } }
  const loc = raw.location || raw;
  return {
    batchId: raw.batchId ?? loc.batchId ?? 0,
    locationId: raw.locationId ?? loc.id ?? loc.locationId ?? 0,
    locationCode: raw.locationCode ?? loc.locationCode ?? loc.code ?? '',
    warehouse: raw.warehouse ?? loc.warehouse ?? '',
    section: raw.section ?? loc.section ?? '',
    shelf: raw.shelf ?? loc.shelf ?? '',
    quantity: raw.quantity ?? 0,
  };
};

export const BatchLocationsModal = ({ isOpen, onClose, batch }: BatchLocationsModalProps) => {
  const [locations, setLocations] = useState<BatchLocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && batch?.id) {
      fetchLocations();
    } else if (!isOpen) {
      setLocations([]);
    }
  }, [isOpen, batch]);

  const fetchLocations = async () => {
    if (!batch?.id) return;
    setLoading(true);
    try {
      const { data } = await apiClient.get(API.LOCATIONS.BY_BATCH(batch.id));
      const raw = Array.isArray(data) ? data : [];
      console.log('[BatchLocationsModal] raw response:', raw); // debug
      setLocations(raw.map(normalize));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch batch locations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Batch Locations">
      <div className="p-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 grid grid-cols-3 gap-4 text-center sm:text-left">
          <div className="text-left">
            <p className="text-sm text-muted">Batch Number</p>
            <p className="font-semibold text-text">{batch?.batchNumber}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted">Remaining Qty</p>
            <p className="font-semibold text-primary">{batch?.remainingQuantity ?? batch?.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Product</p>
            <p className="font-semibold text-text">{batch?.productName}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-muted text-sm">Loading locations...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <MapPin size={48} className="text-muted opacity-30 mb-4" />
            <p className="font-semibold text-text">No Locations Found</p>
            <p className="text-sm text-muted mt-1 max-w-sm">
              This batch has not been assigned to any physical locations yet.
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface border-b border-border text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Location Code</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Shelf</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {locations.map((loc, i) => (
                  <tr key={i} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-text flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      {loc.locationCode}
                    </td>
                    <td className="px-4 py-3 text-text">{loc.warehouse}</td>
                    <td className="px-4 py-3 text-text">{loc.section}</td>
                    <td className="px-4 py-3 text-text">{loc.shelf}</td>
                    <td className="px-4 py-3 text-right font-bold text-text">
                      {loc.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};
