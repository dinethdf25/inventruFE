import { useForm } from 'react-hook-form';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { InventoryAdjustment } from '@/types';
import { useProducts } from '@/hooks/useProducts';

export interface AdjustmentFormProps {
  onSubmit: (data: Partial<InventoryAdjustment>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdjustmentForm = ({ onSubmit, onCancel, isLoading }: AdjustmentFormProps) => {
  const { products, loading: productsLoading } = useProducts();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      productId: '',
      type: 'ADJUSTMENT',
      quantity: 1,
      reason: '',
    }
  });

  const productOptions = [
    { label: '-- Select a Product --', value: '' },
    ...products.map(p => ({
      label: `${p.name} (${(p as any).sku || p.id})`,
      value: p.id
    }))
  ];

  const typeOptions = [
    { label: 'Stock In', value: 'IN' },
    { label: 'Stock Out', value: 'OUT' },
    { label: 'Adjustment (Correction)', value: 'ADJUSTMENT' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <Select
        label="Product"
        options={productOptions}
        error={errors.productId?.message as string}
        disabled={productsLoading}
        {...register('productId', { required: 'Please select a product' })}
      />
      
      <Select
        label="Adjustment Type"
        options={typeOptions}
        error={errors.type?.message as string}
        {...register('type', { required: 'Type is required' })}
      />
      
      <Input
        label="Quantity (Absolute Value)"
        type="number"
        min="1"
        error={errors.quantity?.message as string}
        {...register('quantity', { 
          required: 'Quantity is required',
          valueAsNumber: true,
          min: { value: 1, message: 'Must be at least 1' }
        })}
      />
      
      <Textarea
        label="Reason"
        placeholder="e.g., Damaged goods, stock count mismatch..."
        error={errors.reason?.message as string}
        rows={3}
        {...register('reason', { required: 'Please provide a reason' })}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          Submit Adjustment
        </Button>
      </div>
    </form>
  );
};
