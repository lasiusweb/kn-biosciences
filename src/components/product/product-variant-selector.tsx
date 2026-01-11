"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface VariantOption {
  id: string;
  value: string;
  color?: string; // Hex code for swatches
}

interface Variant {
  id: string;
  name: string;
  type: 'swatch' | 'dropdown';
  options: VariantOption[];
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  onSelect: (variantId: string, optionId: string) => void;
  className?: string;
}

export function ProductVariantSelector({
  variants,
  onSelect,
  className,
}: ProductVariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleSelect = (variantId: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantId]: optionId,
    }));
    onSelect(variantId, optionId);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {variants.map((variant) => (
        <div key={variant.id} className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {variant.name}
            </h4>
            {selectedOptions[variant.id] && (
              <span className="text-xs text-stone-500 font-medium">
                {variant.options.find(o => o.id === selectedOptions[variant.id])?.value}
              </span>
            )}
          </div>

          {variant.type === 'swatch' ? (
            <div className="flex flex-wrap gap-3">
              {variant.options.map((option) => (
                <button
                  key={option.id}
                  aria-label={option.value}
                  onClick={() => handleSelect(variant.id, option.id)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    selectedOptions[variant.id] === option.id 
                      ? "border-primary scale-110 shadow-sm" 
                      : "border-stone-200 hover:border-stone-300"
                  )}
                  style={{ backgroundColor: option.color || '#ccc' }}
                >
                  <span className="sr-only">{option.value}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedOptions[variant.id] || ""}
                onChange={(e) => handleSelect(variant.id, e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
              >
                <option value="" disabled>Select {variant.name}</option>
                {variant.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
