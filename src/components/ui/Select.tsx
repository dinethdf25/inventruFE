import React, { forwardRef, SelectHTMLAttributes } from 'react';

export interface Option {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options = [],
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <select
        ref={ref}
        className={`w-full rounded-lg border bg-card px-3 py-2 text-text transition-colors
          focus:outline-none focus:ring-2
          ${error 
            ? 'border-danger focus:border-danger focus:ring-danger/20' 
            : 'border-border focus:border-primary focus:ring-primary/20'
          }
          ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
