import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function ProductStencil({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="pt-4 border-t border-stone-100 flex items-center gap-4">
        <Skeleton className="h-12 w-24 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
    </div>
  );
}

export function CheckoutStencilUnified({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="pt-8 border-t border-stone-100">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
    </div>
  );
}
