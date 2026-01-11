"use client"

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { totalItems } = useCart();

  return (
    <div className={cn("relative inline-flex items-center p-2 hover:bg-stone-100 rounded-full transition-colors", className)} aria-label="cart">
      <ShoppingCart className="w-6 h-6 text-stone-700" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  );
}
