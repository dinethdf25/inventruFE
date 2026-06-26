import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { DataTable, Column } from '@/components/composite/DataTable';
import { Modal } from '@/components/composite/Modal';
import { ConfirmDialog } from '@/components/composite/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/composite/SearchBar';
import { ProductForm } from './components/ProductForm';

export const ProductsPage = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selected product for edit/delete
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Submitting state for forms
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Handlers
  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Product>) => {
    setIsSubmitting(true);
    let success = false;
    
    if (selectedProduct) {
      success = await updateProduct(selectedProduct.id as string, data);
    } else {
      success = await createProduct(data);
    }
    
    setIsSubmitting(false);
    if (success) {
      setIsFormModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    const success = await deleteProduct(selectedProduct.id as string);
    setIsSubmitting(false);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return <Badge variant="success">In Stock</Badge>;
      case 'LOW_STOCK': return <Badge variant="warning">Low Stock</Badge>;
      case 'OUT_OF_STOCK': return <Badge variant="danger">Out of Stock</Badge>;
      default: return <Badge variant="muted">{status}</Badge>;
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (value, row: Product) => (
        <div>
          <p className="font-medium text-text">{value}</p>
          <p className="text-xs text-muted">{row.id}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: true },
    { 
      key: 'unitPrice', 
      label: 'Unit Price',
      sortable: true,
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    {
      key: 'reorderLevel',
      label: 'Reorder Level',
      sortable: true,
    },
    {
      key: 'stock',
      label: 'Stock Level',
      sortable: true,
      render: (value, row: Product) => {
        const stock = value || 0;
        const reorder = row.reorderLevel || 0;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${stock <= reorder ? 'text-danger' : 'text-text'}`}>
              {stock}
            </span>
            <span className="text-xs text-muted">/ min {reorder}</span>
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row: Product) => (
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
          <h1 className="text-2xl font-bold text-text">Product Catalog</h1>
          <p className="text-muted">Manage your inventory catalog, categories, and stock limits.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="shrink-0 flex items-center gap-2">
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search products by name or SKU..."
            className="w-full sm:max-w-md"
          />
        </div>
        
        <DataTable
          columns={columns}
          data={filteredProducts}
          loading={loading}
          empty={
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-muted mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-text">No Products Found</h3>
              <p className="text-muted mt-1 max-w-sm mx-auto">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first product to the catalog.'}
              </p>
              {!searchTerm && (
                <Button variant="outline" onClick={handleCreate} className="mt-4">
                  <Plus size={16} className="mr-2" /> Add Product
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !isSubmitting && setIsFormModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <div className="p-6">
          <ProductForm 
            initialData={selectedProduct || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isSubmitting}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={
          <>
            Are you sure you want to delete <strong className="text-text">{selectedProduct?.name}</strong>? This action cannot be undone and will remove all associated batch history.
          </>
        }
        confirmLabel="Delete"
        variant="danger"
        loading={isSubmitting}
      />
    </div>
  );
};
