"use client"

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { CheckoutPaymentByExpress } from '@/components/checkout/checkout-payment-by-express';
import { formatCurrency, formatName, formatPhoneNumber } from '@/lib/i18n-utils';
import { ShieldCheck, Truck, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function CheckoutPage() {
  const { totalPrice, items, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const handlePayment = async () => {
    // Basic validation
    if (!formData.name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please provide your name and phone number.",
        variant: "destructive"
      });
      return;
    }

    // Logic for actual handoff would go here
    console.log('Finalizing order for', formatName(formData.name), 'at', formatPhoneNumber(formData.phone));
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Order Placed!",
      description: "Redirecting to payment gateway...",
    });
    
    // clearCart(); // Typically after successful payment
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/cart" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-primary mb-8 group">
          <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Shipping Form */}
          <div className="space-y-8">
            <section className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-stone-900">Shipping Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">Full Name</label>
                    <Input 
                      placeholder="e.g. Sudha Reddy" 
                      className="rounded-xl h-12 border-stone-100"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">Phone Number</label>
                    <Input 
                      placeholder="e.g. 9999999999" 
                      className="rounded-xl h-12 border-stone-100"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest ml-1">Complete Address</label>
                  <Input 
                    placeholder="House No, Street, Landmark" 
                    className="rounded-xl h-12 border-stone-100"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="City" 
                    className="rounded-xl h-12 border-stone-100"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                  <Input 
                    placeholder="ZIP Code" 
                    className="rounded-xl h-12 border-stone-100"
                    value={formData.zip}
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-2 text-stone-400 justify-center">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Encrypted Checkout</span>
            </div>
          </div>

          {/* Right: Payment */}
          <aside className="space-y-6">
            <div className="bg-stone-900 rounded-[2rem] p-8 text-white shadow-xl shadow-stone-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold">Payment Summary</h2>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Total Items ({items.length})</span>
                  <span className="font-bold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Standard Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest pt-1">Free</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="text-stone-400 font-medium">Grand Total</span>
                  <span className="text-3xl font-bold text-amber-400">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <CheckoutPaymentByExpress 
                total={totalPrice} 
                onInitiate={handlePayment}
              />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-100 space-y-4">
               <p className="text-xs font-bold text-stone-900 uppercase tracking-tight">Order Review</p>
               <div className="space-y-3">
                 {items.slice(0, 3).map(item => (
                   <div key={item.id} className="flex justify-between text-xs">
                     <span className="text-stone-500">{item.quantity}x {item.name}</span>
                     <span className="font-bold text-stone-900">{formatCurrency(item.price * item.quantity)}</span>
                   </div>
                 ))}
                 {items.length > 3 && (
                   <p className="text-[10px] text-stone-400 text-center">+ {items.length - 3} more items</p>
                 )}
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}