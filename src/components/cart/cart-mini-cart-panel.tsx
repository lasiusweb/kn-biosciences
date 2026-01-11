"use client"

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CartItemsUi } from "./cart-items-ui";

interface CartMiniCartPanelProps {
  children: React.ReactNode;
}

export function CartMiniCartPanel({ children }: CartMiniCartPanelProps) {
  const { items, totalItems, totalPrice } = useCart();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-stone-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-stone-900">Your cart is empty</p>
                <p className="text-sm text-stone-500">Add some products to get started!</p>
              </div>
              <SheetTrigger asChild>
                <Button asChild variant="outline" className="rounded-full px-8">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </SheetTrigger>
            </div>
          ) : (
            <CartItemsUi isMini={true} />
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-stone-100 pt-6 flex-col sm:flex-col gap-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-stone-500 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-stone-900">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-[10px] text-stone-400 text-center">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              <Button asChild className="w-full rounded-full h-12 text-lg font-bold">
                <Link href="/checkout">
                  Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full rounded-full text-stone-500 hover:text-primary">
                  Continue Shopping
                </Button>
              </SheetTrigger>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
