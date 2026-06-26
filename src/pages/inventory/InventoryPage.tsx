import { useState, useMemo } from 'react';
import { Plus, ClipboardList, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useProducts } from '@/hooks/useProducts';
import { InventoryAdjustment } from '@/types';
import { DataTable, Column } from '@/components/composite/DataTable';
import { Modal } from '@/components/composite/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/composite/SearchBar';
import { AdjustmentForm } from './components/AdjustmentForm';

export const InventoryPage = () => {
  const { history, loading, adjustStock } = useInventory();
  const { products } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map product names onto adjustments
  const enrichedHistory = useMemo(() => {
    return history.map(adj => {
      const product = products.find(p => p.id === adj.productId);
      return { ...adj, productName: product ? product.name : 'Unknown Product' };
    });
  }, [history, products]);

  // Derived filtered history
  const filteredHistory = useMemo(() => {
    return enrichedHistory.filter(h => 
      h.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enrichedHistory, searchTerm]);

  // Handlers
  const handleCreate = () => {
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<InventoryAdjustment>) => {
    setIsSubmitting(true);
    
    // Default user to "Admin" since Auth isn't fully set up yet
    const success = await adjustStock({ 
      ...data, 
      user: 'Admin',
      date: new Date().toISOString()
    });
    
    setIsSubmitting(false);
    if (success) {
      setIsFormModalOpen(false);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'IN': 
        return <Badge variant="success"><div className="flex gap-1 items-center w-fit"><ArrowUpRight size={12}/> Stock In</div></Badge>;
      case 'OUT': 
        return <Badge variant="warning"><div className="flex gap-1 items-center w-fit"><ArrowDownRight size={12}/> Stock Out</div></Badge>;
      case 'ADJUSTMENT': 
        return <Badge variant="primary"><div className="flex gap-1 items-center w-fit"><RefreshCcw size={12}/> Adjustment</div></Badge>;
      default: 
        return <Badge variant="muted">{type}</Badge>;
    }
  };

  const getQuantityDisplay = (type: string, quantity: number) => {
    if (type === 'OUT') {
      return <span className="text-warning font-medium">-{quantity}</span>;
    }
    if (type === 'IN') {
      return <span className="text-success font-medium">+{quantity}</span>;
    }
    return <span className="text-primary font-medium">±{quantity}</span>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const columns: Column[] = [
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      render: (value) => <span className="text-sm text-text">{formatDate(value)}</span>,
    },
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
      render: (value) => <span className="font-medium text-text">{value}</span>,
    },
    {
      key: 'type',
      label: 'Adjustment Type',
      sortable: true,
      render: (value) => getTypeBadge(value),
    },
    { 
      key: 'quantity', 
      label: 'Qty', 
      sortable: true,
      render: (value, row: any) => getQuantityDisplay(row.type, value)
    },
    { 
      key: 'reason', 
      label: 'Reason',
      render: (value) => <span className="text-sm text-muted">{value}</span>
    },
    { 
      key: 'user', 
      label: 'User',
      render: (value) => <span className="text-sm text-muted">{value}</span>
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Inventory Ledger</h1>
          <p className="text-muted">Track historical stock movements and make manual adjustments.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="shrink-0 flex items-center gap-2">
          <Plus size={18} />
          New Adjustment
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search by product or reason..."
            className="w-full sm:max-w-md"
          />
        </div>
        
        <DataTable
          columns={columns}
          data={filteredHistory}
          loading={loading}
          empty={
            <div className="text-center py-12">
              <ClipboardList size={48} className="mx-auto text-muted mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-text">No Adjustment History</h3>
              <p className="text-muted mt-1 max-w-sm mx-auto">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Your inventory history ledger is empty.'}
              </p>
            </div>
          }
        />
      </div>

      {/* New Adjustment Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !isSubmitting && setIsFormModalOpen(false)}
        title="Manual Stock Adjustment"
      >
        <div className="p-6">
          <AdjustmentForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isSubmitting}
          />
        </div>
      </Modal>
    </div>
  );
};
