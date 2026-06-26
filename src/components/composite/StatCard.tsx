import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Spinner } from '@/components/ui';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconColor?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  trend?: string;
  trendUp?: boolean;
  href?: string;
  loading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  iconColor = 'primary',
  trend,
  trendUp,
  href,
  loading = false,
}: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  const content = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <div className="h-8 w-24 bg-surface rounded animate-pulse" />
          ) : (
            <h4 className="text-2xl font-bold text-text">{value}</h4>
          )}
          {trend && !loading && (
            <span className={`flex items-center text-sm font-medium ${trendUp ? 'text-success' : 'text-danger'}`}>
              {trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={`p-3 rounded-lg ${colorClasses[iconColor]}`}>
        {loading ? <Spinner size="sm" /> : icon}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block group">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30">
          {content}
        </div>
      </Link>
    );
  }

  return (
    <Card className="!p-0">
      <div className="p-6">
        {content}
      </div>
    </Card>
  );
};
