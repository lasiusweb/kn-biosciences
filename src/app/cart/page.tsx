"use client"

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { CartItemsUi } from '@/components/cart/cart-items-ui';
import { CheckoutButtonUi } from '@/components/checkout/checkout-button-ui';
import { formatCurrency } from '@/lib/i18n-utils';
import { ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { totalItems, totalPrice, items } = useCart();

  if (totalItems === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingCart className="w-10 h-10 text-stone-200" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Your cart is empty</h1>
        <p className="text-stone-500 mb-8 text-center max-w-xs">
          Looks like you haven't added any bio-science solutions yet.
        </p>
        <Button asChild className="rounded-full px-10 h-12 text-lg font-bold">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop" className="p-2 hover:bg-white rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-stone-400 group-hover:text-primary" />
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">Shopping Cart</h1>
          <span className="text-stone-400 font-bold bg-white px-3 py-1 rounded-full text-xs shadow-sm border border-stone-100">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm">
              <CartItemsUi />
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="text-sm font-bold text-primary">Secure Shopping Guarantee</p>
                <p className="text-xs text-primary/70 leading-relaxed mt-1">
                  Your data is protected with 256-bit SSL encryption. We never store your full payment card details.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-bold text-stone-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span className="text-primary font-bold">Calculated next</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">GST (18%)</span>
                  <span className="text-stone-400">Included</span>
                </div>
                <div className="pt-4 border-t border-stone-50 flex justify-between">
                  <span className="text-lg font-bold text-stone-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <CheckoutButtonUi total={totalPrice} className="mb-4" />
              
              <div className="text-center">
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">
                  Accepted Payments
                </p>
                <div className="mt-3 flex justify-center gap-3 opacity-50 grayscale">
                   <div className="w-10 h-6 bg-stone-100 rounded" />
                   <div className="w-10 h-6 bg-stone-100 rounded" />
                   <div className="w-10 h-6 bg-stone-100 rounded" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
