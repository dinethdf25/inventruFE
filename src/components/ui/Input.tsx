import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  iconRight,
  type = 'text',
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full rounded-lg border bg-card px-3 py-2 text-text placeholder-muted transition-colors
            focus:outline-none focus:ring-2
            ${icon ? 'pl-10' : ''} 
            ${iconRight ? 'pr-10' : ''}
            ${error 
              ? 'border-danger focus:border-danger focus:ring-danger/20' 
              : 'border-border focus:border-primary focus:ring-primary/20'
            }
            ${className}`}
          {...rest}
        />
        {iconRight && (
          <div className="absolute right-3 text-muted pointer-events-none">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {hint && !error && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
