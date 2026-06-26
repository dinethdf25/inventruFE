import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Batch } from '@/types';
import { useProducts } from '@/hooks/useProducts';

export interface BatchFormProps {
  onSubmit: (data: Partial<Batch>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BatchForm = ({ onSubmit, onCancel, isLoading }: BatchFormProps) => {
  const { products, loading: productsLoading } = useProducts();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      productId: '',
      batchNumber: '',
      quantity: 100,
      manufactureDate: '',
      expiryDate: '',
      supplierId: 1, // Defaulting to 1 since we don't have Supplier dropdown yet
      locationId: 1, // Defaulting to 1 since we don't have Location dropdown yet
      purchasePrice: 0,
    }
  });

  const productOptions = [
    { label: '-- Select a Product --', value: '' },
    ...products.map(p => ({
      // We removed SKU from product in Phase 1, so just name
      label: p.name,
      value: p.id
    }))
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Product"
        options={productOptions}
        error={errors.productId?.message as string}
        disabled={productsLoading}
        {...register('productId', { required: 'Please select a product' })}
      />
      
      <Input
        label="Batch Number"
        placeholder="e.g. BATCH-032"
        error={errors.batchNumber?.message as string}
        {...register('batchNumber', { required: 'Batch number is required' })}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity Received"
          type="number"
          min="1"
          error={errors.quantity?.message as string}
          {...register('quantity', { 
            required: 'Quantity is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Must receive at least 1 unit' }
          })}
        />
        
        <Input
          label="Purchase Price"
          type="number"
          min="0"
          step="0.01"
          error={errors.purchasePrice?.message as string}
          {...register('purchasePrice', { 
            required: 'Purchase price is required',
            valueAsNumber: true
          })}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Manufacture Date"
          type="date"
          error={errors.manufactureDate?.message as string}
          {...register('manufactureDate', { required: 'Manufacture date is required' })}
        />
        
        <Input
          label="Expiry Date"
          type="date"
          error={errors.expiryDate?.message as string}
          {...register('expiryDate', { required: 'Expiry date is required' })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Supplier ID"
          type="number"
          error={errors.supplierId?.message as string}
          {...register('supplierId', { 
            required: 'Supplier ID is required',
            valueAsNumber: true 
          })}
        />
        
        <Input
          label="Location ID"
          type="number"
          error={errors.locationId?.message as string}
          {...register('locationId', { 
            required: 'Location ID is required',
            valueAsNumber: true 
          })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          Receive Batch
        </Button>
      </div>
    </form>
  );
};
