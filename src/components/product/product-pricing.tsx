"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface PriceRange {
  min: number;
  max?: number;
  price: number;
}

interface SubscriptionOption {
  duration: string;
  price: number;
}

interface ProductPricingProps {
  basePrice: number;
  ranges?: PriceRange[];
  subscriptions?: SubscriptionOption[];
  currentQuantity?: number;
  selectedSubscription?: string;
  className?: string;
}

export function ProductPricing({
  basePrice,
  ranges,
  subscriptions,
  currentQuantity = 1,
  selectedSubscription,
  className,
}: ProductPricingProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  let displayPrice = basePrice;
  let isDiscounted = false;
  let unit = "";

  // Handle Range-based pricing
  if (ranges && currentQuantity > 0) {
    const activeRange = ranges.find(
      (r) => currentQuantity >= r.min && (!r.max || currentQuantity <= r.max)
    );
    if (activeRange) {
      displayPrice = activeRange.price;
      if (displayPrice < basePrice) isDiscounted = true;
    }
  }

  // Handle Subscription override
  if (subscriptions && selectedSubscription) {
    const sub = subscriptions.find((s) => s.duration === selectedSubscription);
    if (sub) {
      displayPrice = sub.price;
      unit = selectedSubscription === 'monthly' ? '/ month' : selectedSubscription === 'yearly' ? '/ year' : '';
      isDiscounted = false; // Subscriptions are their own pricing model usually
    }
  }

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-stone-900 tracking-tight">
          {formatCurrency(displayPrice)}
        </span>
        {unit && (
          <span className="text-sm font-medium text-stone-500">{unit}</span>
        )}
        {isDiscounted && (
          <span className="text-lg text-stone-400 line-through decoration-primary/30">
            {formatCurrency(basePrice)}
          </span>
        )}
      </div>
      
      {isDiscounted && (
        <p className="text-xs font-bold text-primary uppercase tracking-wider">
          Bulk Discount Applied
        </p>
      )}
      
      {!selectedSubscription && ranges && (
        <div className="mt-2 grid grid-cols-1 gap-1">
           {ranges.map((range, idx) => (
             <p key={idx} className={cn("text-[10px] text-stone-500", 
               currentQuantity >= range.min && (!range.max || currentQuantity <= range.max) && "text-primary font-bold"
             )}>
               {range.min}{range.max ? `-${range.max}` : '+'} units: {formatCurrency(range.price)}
             </p>
           ))}
        </div>
      )}
    </div>
  );
}
