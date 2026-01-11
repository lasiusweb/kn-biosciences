"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductAddToCartProps {
  productId: string;
  stock: number;
  min?: number;
  max?: number;
  increment?: number;
  onAdd: (productId: string, quantity: number) => void;
  className?: string;
}

export function ProductAddToCart({
  productId,
  stock,
  min = 1,
  max = 100,
  increment = 1,
  onAdd,
  className,
}: ProductAddToCartProps) {
  const [quantity, setQuantity] = useState<number>(min);

  const isOutOfStock = stock <= 0;
  const isInvalidQuantity = quantity < min || quantity > Math.min(max, stock > 0 ? stock : max);
  const isDisabled = isOutOfStock || isInvalidQuantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setQuantity(val);
    } else {
      setQuantity(0);
    }
  };

  const handleAdd = () => {
    if (!isDisabled) {
      onAdd(productId, quantity);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-[120px]">
          <label htmlFor={`qty-${productId}`} className="sr-only">Quantity</label>
          <Input
            id={`qty-${productId}`}
            type="number"
            min={min}
            max={stock > 0 ? Math.min(max, stock) : max}
            step={increment}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isOutOfStock}
            className="rounded-full border-stone-200 focus:ring-primary h-12 text-center text-lg font-medium"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={isDisabled}
          className="flex-1 rounded-full h-12 text-lg font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      
      {stock > 0 && stock < 10 && (
        <p className="text-amber-600 text-xs font-bold animate-pulse">
          Only {stock} left in stock!
        </p>
      )}
      
      {quantity > stock && stock > 0 && (
        <p className="text-destructive text-xs font-bold">
          Cannot exceed available stock ({stock}).
        </p>
      )}
    </div>
  );
}
