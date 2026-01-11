"use client"

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CommonNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function CommonNumberInput({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  className,
  disabled,
}: CommonNumberInputProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val >= min && val <= max) {
        onChange(val);
      }
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full border-stone-200"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3 w-3" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="h-8 w-12 text-center p-0 rounded-md border-stone-200 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-bold text-sm"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full border-stone-200"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3 w-3" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
