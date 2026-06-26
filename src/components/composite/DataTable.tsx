import React, { ReactNode } from 'react';
import { TableSkeleton } from './TableSkeleton';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}

export interface DataTableProps {
  columns: Column[];
  data?: any[];
  loading?: boolean;
  empty?: ReactNode;
  onRowClick?: (row: any) => void;
  rowClassName?: (row: any) => string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
}

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  empty,
  onRowClick,
  rowClassName,
  pagination,
  onSort,
  sortConfig,
}: DataTableProps) => {
  if (loading) {
    return <TableSkeleton columns={columns.length} rows={5} />;
  }

  if (data.length === 0 && empty) {
    return empty;
  }

  return (
    <div className="w-full overflow-hidden border border-border rounded-xl bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 text-sm font-semibold text-muted ${col.width || ''}`}
                >
                  {col.sortable ? (
                    <button
                      className="flex items-center gap-1 hover:text-text focus:outline-none"
                      onClick={() => onSort?.(col.key)}
                    >
                      {col.label}
                      {sortConfig?.key === col.key && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-surface/50' : ''} ${rowClassName ? rowClassName(row) : ''}`}
              >
                {columns.map((col: Column) => (
                  <td key={`${row.id || i}-${col.key}`} className="px-6 py-4 text-sm text-text">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-card gap-4">
          <p className="text-sm text-muted">
            Showing <span className="font-medium">{Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.pageSize, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => pagination.onChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              onClick={() => pagination.onChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
