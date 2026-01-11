import React from 'react';
import { cn } from '@/lib/utils';

interface ProductHeadingProps {
  name: string;
  sku?: string;
  category?: string;
  className?: string;
}

export function ProductHeading({
  name,
  sku,
  category,
  className,
}: ProductHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {category && (
        <p className="text-sm font-bold text-primary uppercase tracking-widest">
          {category}
        </p>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
        {name}
      </h1>
      {sku && (
        <p className="text-xs font-medium text-stone-400 uppercase tracking-tighter">
          SKU: {sku}
        </p>
      )}
    </div>
  );
}
