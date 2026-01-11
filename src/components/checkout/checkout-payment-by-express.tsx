"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutPaymentByExpressProps {
  total: number;
  onInitiate?: () => void;
  className?: string;
  disabled?: boolean;
}

export function CheckoutPaymentByExpress({
  total,
  onInitiate,
  className,
  disabled,
}: CheckoutPaymentByExpressProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    if (onInitiate) {
      await onInitiate();
    } else {
      // Mock logic for Easebuzz handoff
      console.log('Initiating Easebuzz payment for', total);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setLoading(false);
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <Button
        onClick={handlePayment}
        disabled={disabled || loading}
        variant="secondary"
        className="w-full h-14 rounded-full text-lg font-bold bg-amber-400 hover:bg-amber-500 text-stone-900 border-none shadow-md transition-all active:scale-95"
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Zap className="mr-2 h-5 w-5 fill-current" />
        )}
        Pay Express
      </Button>
      <p className="text-[10px] text-center text-stone-400 font-medium uppercase tracking-widest">
        Secure checkout via Easebuzz
      </p>
    </div>
  );
}
