import React, { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  rows = 4,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full rounded-lg border bg-card px-3 py-2 text-text placeholder-muted transition-colors
          focus:outline-none focus:ring-2 resize-y
          ${error 
            ? 'border-danger focus:border-danger focus:ring-danger/20' 
            : 'border-border focus:border-primary focus:ring-primary/20'
          }
          ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
