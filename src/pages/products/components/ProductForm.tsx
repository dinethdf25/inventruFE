import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Product } from '@/types';

export interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      category: 'Produce',
      reorderLevel: 10,
      unitPrice: 0,
    }
  });

  const categoryOptions = [
    { label: 'Produce', value: 'Produce' },
    { label: 'Dairy', value: 'Dairy' },
    { label: 'Meat', value: 'meats' }, // Adjusting to match Postman 'meats' example
    { label: 'Bakery', value: 'Bakery' },
    { label: 'Beverages', value: 'Beverages' },
    { label: 'Pantry', value: 'Pantry' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Name"
        placeholder="e.g. Organic Tomatoes"
        error={errors.name?.message as string}
        {...register('name', { required: 'Product name is required' })}
      />
      
      <Select
        label="Category"
        options={categoryOptions}
        error={errors.category?.message as string}
        {...register('category', { required: 'Category is required' })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Reorder Level"
          type="number"
          min="0"
          error={errors.reorderLevel?.message as string}
          {...register('reorderLevel', { 
            required: 'Reorder level is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Must be a positive number' }
          })}
        />
        
        <Input
          label="Unit Price"
          type="number"
          min="0"
          step="0.01"
          error={errors.unitPrice?.message as string}
          {...register('unitPrice', { 
            required: 'Unit price is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Must be a positive number' }
          })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
