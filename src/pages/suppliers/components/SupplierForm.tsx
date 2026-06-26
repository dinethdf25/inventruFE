import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Supplier } from '@/types';

export interface SupplierFormProps {
  initialData?: Partial<Supplier>;
  onSubmit: (data: Partial<Supplier>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SupplierForm = ({ initialData, onSubmit, onCancel, isLoading }: SupplierFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      contactEmail: '',
      phone: '',
      rating: 5,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Supplier Name"
        placeholder="e.g. Fresh Farms Inc."
        error={errors.name?.message as string}
        {...register('name', { required: 'Name is required' })}
      />
      
      <Input
        label="Contact Email"
        type="email"
        placeholder="e.g. contact@freshfarms.com"
        error={errors.contactEmail?.message as string}
        {...register('contactEmail', { 
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
        })}
      />
      
      <Input
        label="Phone Number"
        placeholder="e.g. 0718975675"
        error={errors.phone?.message as string}
        {...register('phone', { required: 'Phone is required' })}
      />

      <Input
        label="Initial Rating (0.0 to 5.0)"
        type="number"
        min="0"
        max="5"
        step="0.1"
        error={errors.rating?.message as string}
        {...register('rating', { 
          required: 'Rating is required',
          valueAsNumber: true,
          min: { value: 0, message: 'Minimum 0' },
          max: { value: 5, message: 'Maximum 5' }
        })}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Supplier'}
        </Button>
      </div>
    </form>
  );
};
