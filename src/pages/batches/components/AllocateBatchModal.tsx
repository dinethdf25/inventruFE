import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useProducts } from '@/hooks/useProducts';
import { Modal } from '@/components/composite/Modal';
import { Layers, CheckCircle2 } from 'lucide-react';

export interface AllocateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: string, quantity: number) => Promise<any>;
}

export const AllocateBatchModal = ({ isOpen, onClose, onSubmit }: AllocateBatchModalProps) => {
  const { products, loading: productsLoading } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocationResult, setAllocationResult] = useState<any[] | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      productId: '',
      quantity: 1,
    }
  });

  const productOptions = [
    { label: '-- Select a Product --', value: '' },
    ...products.map(p => ({
      label: p.name,
      value: p.id
    }))
  ];

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    const result = await onSubmit(data.productId, data.quantity);
    setIsSubmitting(false);
    
    if (result && Array.isArray(result) && result.length > 0) {
      setAllocationResult(result);
    } else if (result) {
      handleClose();
    }
  };

  const handleClose = () => {
    reset();
    setAllocationResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isSubmitting && handleClose()} title="Allocate Stock (FIFO/FEFO)">
      <div className="p-6">
        {allocationResult ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center p-4 border border-success/20 bg-success/5 rounded-xl">
              <CheckCircle2 size={48} className="text-success mb-3" />
              <h3 className="text-lg font-semibold text-text">Stock Allocated Successfully</h3>
              <p className="text-sm text-muted mt-1">The requested quantity was pulled from the following batches:</p>
            </div>
            
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface border-b border-border text-muted uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Batch Number</th>
                    <th className="px-4 py-3 text-right">Allocated Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allocationResult.map((res, i) => (
                    <tr key={i} className="hover:bg-surface-hover/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-text flex items-center gap-2">
                        <Layers size={14} className="text-primary" />
                        {res.batchNumber}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-success">
                        -{res.allocatedQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button variant="primary" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-4">
              Allocating stock will automatically reduce inventory from the most appropriate batches based on expiry rules.
            </p>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <Select
                label="Product"
                options={productOptions}
                error={errors.productId?.message as string}
                disabled={productsLoading || isSubmitting}
                {...register('productId', { required: 'Please select a product' })}
              />
              <Input
                label="Quantity to Allocate"
                type="number"
                min="1"
                error={errors.quantity?.message as string}
                disabled={isSubmitting}
                {...register('quantity', { 
                  required: 'Quantity is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must allocate at least 1 unit' }
                })}
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button variant="ghost" type="button" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={isSubmitting}>
                  Allocate Stock
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};
