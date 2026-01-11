"use client"

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { CommonNumberInput } from '@/components/common/common-number-input';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartItemsUiProps {
  className?: string;
  isMini?: boolean;
}

export function CartItemsUi({ className, isMini = false }: CartItemsUiProps) {
  const { items, updateQuantity, removeItem } = useCart();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item) => (
        <div key={`${item.id}-${item.variantId}`} className="flex gap-4 group">
          <div className={cn("bg-stone-100 rounded-xl overflow-hidden shrink-0", 
            isMini ? "w-20 h-20" : "w-24 h-24"
          )}>
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h4>
                {item.variantName && (
                  <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mt-0.5">{item.variantName}</p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-stone-300 hover:text-destructive transition-colors -mr-2"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <CommonNumberInput 
                value={item.quantity}
                onChange={(val) => updateQuantity(item.id, val)}
                className="scale-90 origin-left"
              />
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">{formatCurrency(item.price * item.quantity)}</p>
                {item.quantity > 1 && (
                  <p className="text-[10px] text-stone-400">{formatCurrency(item.price)} each</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
