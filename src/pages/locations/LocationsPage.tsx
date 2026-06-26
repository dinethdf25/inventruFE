import { useState, useMemo } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { Location } from '@/types';
import { DataTable, Column } from '@/components/composite/DataTable';
import { Modal } from '@/components/composite/Modal';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/composite/SearchBar';
import { LocationForm } from './components/LocationForm';

export const LocationsPage = () => {
  const { locations, loading, createLocation } = useLocations();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredLocations = useMemo(() => {
    return locations.filter(l => 
      l.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.shelf.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const handleCreate = () => {
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Location>) => {
    setIsSubmitting(true);
    const success = await createLocation(data);
    setIsSubmitting(false);
    if (success) {
      setIsFormModalOpen(false);
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => <span className="font-medium text-text">LOC-{value}</span>,
    },
    { key: 'warehouse', label: 'Warehouse', sortable: true },
    { key: 'section', label: 'Section', sortable: true },
    { key: 'shelf', label: 'Shelf', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Locations</h1>
          <p className="text-muted">Manage your warehouse locations and capacities.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="shrink-0 flex items-center gap-2">
          <Plus size={18} />
          Add Location
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search locations..."
            className="w-full sm:max-w-md"
          />
        </div>
        
        <DataTable
          columns={columns}
          data={filteredLocations}
          loading={loading}
          empty={
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto text-muted mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-text">No Locations Found</h3>
              <p className="text-muted mt-1 max-w-sm mx-auto">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first location.'}
              </p>
              {!searchTerm && (
                <Button variant="outline" onClick={handleCreate} className="mt-4">
                  <Plus size={16} className="mr-2" /> Add Location
                </Button>
              )}
            </div>
          }
        />
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !isSubmitting && setIsFormModalOpen(false)}
        title="Add New Location"
      >
        <div className="p-6">
          <LocationForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isSubmitting}
          />
        </div>
      </Modal>
    </div>
  );
};
