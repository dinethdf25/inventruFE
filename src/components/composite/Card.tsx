import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card = ({ children, title, action, className = '', noPadding = false }: CardProps) => {
  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-text">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
