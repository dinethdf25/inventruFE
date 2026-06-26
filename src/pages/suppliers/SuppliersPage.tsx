import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Truck, Star } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Supplier } from '@/types';
import { DataTable, Column } from '@/components/composite/DataTable';
import { Modal } from '@/components/composite/Modal';
import { ConfirmDialog } from '@/components/composite/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/composite/SearchBar';
import { SupplierForm } from './components/SupplierForm';

export const SuppliersPage = () => {
  const { suppliers, loading, createSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Supplier>) => {
    setIsSubmitting(true);
    let success = false;
    
    if (selectedSupplier) {
      success = await updateSupplier(selectedSupplier.id as number, data);
    } else {
      success = await createSupplier(data);
    }
    
    setIsSubmitting(false);
    if (success) {
      setIsFormModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupplier) return;
    setIsSubmitting(true);
    const success = await deleteSupplier(selectedSupplier.id as number);
    setIsSubmitting(false);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Supplier',
      sortable: true,
      render: (value, row: Supplier) => (
        <div>
          <p className="font-medium text-text">{value}</p>
          <p className="text-xs text-muted">ID: {row.id}</p>
        </div>
      ),
    },
    { key: 'contactEmail', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-warning">
          <Star size={14} fill="currentColor" />
          <span className="text-text font-medium text-sm">{Number(value).toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row: Supplier) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleEdit(row); }} className="p-2">
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDeleteClick(row); }} className="p-2 text-danger hover:text-danger hover:bg-danger/10">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Suppliers</h1>
          <p className="text-muted">Manage your supplier directory, contacts, and ratings.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="shrink-0 flex items-center gap-2">
          <Plus size={18} />
          Add Supplier
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search suppliers..."
            className="w-full sm:max-w-md"
          />
        </div>
        
        <DataTable
          columns={columns}
          data={filteredSuppliers}
          loading={loading}
          empty={
            <div className="text-center py-12">
              <Truck size={48} className="mx-auto text-muted mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-text">No Suppliers Found</h3>
              <p className="text-muted mt-1 max-w-sm mx-auto">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first supplier.'}
              </p>
              {!searchTerm && (
                <Button variant="outline" onClick={handleCreate} className="mt-4">
                  <Plus size={16} className="mr-2" /> Add Supplier
                </Button>
              )}
            </div>
          }
        />
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !isSubmitting && setIsFormModalOpen(false)}
        title={selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <div className="p-6">
          <SupplierForm 
            initialData={selectedSupplier || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isSubmitting}
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Supplier"
        message={
          <>
            Are you sure you want to delete <strong className="text-text">{selectedSupplier?.name}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        variant="danger"
        loading={isSubmitting}
      />
    </div>
  );
};
