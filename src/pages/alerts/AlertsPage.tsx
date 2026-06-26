import { useState, useMemo } from 'react';
import { BellRing, CheckCircle, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { useAlertStore } from '@/store/alert.store';
import { Alert } from '@/types';
import { DataTable, Column } from '@/components/composite/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const AlertsPage = () => {
  const { alerts, resolveAlert, clearResolved } = useAlertStore();
  
  const [filter, setFilter] = useState<'ALL' | 'UNRESOLVED'>('UNRESOLVED');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Derived filtered alerts
  const filteredAlerts = useMemo(() => {
    const result = [...alerts];
    
    // Sort by most recent first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (filter === 'UNRESOLVED') {
      return result.filter(a => !a.resolved);
    }
    return result;
  }, [alerts, filter]);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    await resolveAlert(id);
    setResolvingId(null);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <Badge variant="danger"><div className="flex gap-1 items-center w-fit"><ShieldAlert size={12}/> Critical</div></Badge>;
      case 'WARNING': return <Badge variant="warning"><div className="flex gap-1 items-center w-fit"><AlertTriangle size={12}/> Warning</div></Badge>;
      case 'INFO': return <Badge variant="info"><div className="flex gap-1 items-center w-fit"><BellRing size={12}/> Info</div></Badge>;
      default: return <Badge variant="muted">{severity}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const columns: Column[] = [
    {
      key: 'createdAt',
      label: 'Time Detected',
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
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (value) => getSeverityBadge(value),
    },
    { 
      key: 'currentStock', 
      label: 'Current Stock', 
      sortable: true,
      render: (value) => <span className="font-medium">{value} units</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row: Alert) => (
        row.resolved ? 
          <Badge variant="success" className="bg-success/5 text-success">Resolved</Badge> : 
          <Badge variant="warning" className="bg-warning/5 text-warning">Action Required</Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row: Alert) => (
        <div className="flex justify-end">
          {!row.resolved && (
            <Button 
              variant="outline" 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleResolve(row.id); }}
              loading={resolvingId === row.id}
              className="text-xs py-1 h-8"
            >
              <Check size={14} className="mr-1" /> Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-3">
            System Alerts
            {alerts.filter(a => !a.resolved).length > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
              </span>
            )}
          </h1>
          <p className="text-muted">Real-time alerts for low stock and expiring items.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {filter === 'ALL' && alerts.some(a => a.resolved) && (
            <Button variant="ghost" onClick={clearResolved} className="text-muted hover:text-danger text-sm h-9">
              Clear Resolved
            </Button>
          )}
          <div className="flex bg-surface border border-border rounded-lg p-1">
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'UNRESOLVED' ? 'bg-card shadow-sm text-text' : 'text-muted hover:text-text'}`}
              onClick={() => setFilter('UNRESOLVED')}
            >
              Unresolved ({alerts.filter(a => !a.resolved).length})
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-card shadow-sm text-text' : 'text-muted hover:text-text'}`}
              onClick={() => setFilter('ALL')}
            >
              All Alerts
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredAlerts}
          empty={
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-success mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-text">All Clear</h3>
              <p className="text-muted mt-1 max-w-sm mx-auto">
                There are no {filter === 'UNRESOLVED' ? 'unresolved ' : ''}alerts requiring your attention at this time.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};
