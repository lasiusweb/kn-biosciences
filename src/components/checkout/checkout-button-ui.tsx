"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/i18n-utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CheckoutButtonUiProps {
  total: number;
  className?: string;
  disabled?: boolean;
}

export function CheckoutButtonUi({
  total,
  className,
  disabled,
}: CheckoutButtonUiProps) {
  return (
    <Button
      asChild
      disabled={disabled}
      className={cn(
        "w-full h-14 rounded-full text-lg font-bold shadow-lg transition-all active:scale-95",
        className
      )}
    >
      <Link href="/checkout" className="flex items-center justify-between px-6">
        <div className="flex items-center">
          <ShoppingBag className="mr-3 h-5 w-5" />
          <span>Checkout</span>
        </div>
        <div className="h-6 w-[1px] bg-white/20 mx-2" />
        <span>{formatCurrency(total)}</span>
      </Link>
    </Button>
  );
}
