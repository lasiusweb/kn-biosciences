'use client';

import { useState } from 'react';
import Image from 'next/image';

const MOCK_ITEMS = [
    { id: '1', title: 'Bio-Fertilizer Pro', price: 1200, quantity: 2, image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400' },
    { id: '2', title: 'Aquaculture Booster', price: 850, quantity: 1, image: 'https://images.unsplash.com/photo-1533038590840-1cde6e6e40df?w=400' },
];

export default function CheckoutPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('easebuzz'); // Default to Easebuzz
    const [address, setAddress] = useState({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        phone: '9999999999',
        street: '123 Agri Lane',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
    });

    const total = MOCK_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: MOCK_ITEMS,
                    userId: '00000000-0000-0000-0000-000000000000', // Mock UUID
                    shippingAddress: address,
                    paymentMethod: paymentMethod, // Include selected payment method
                }),
            });

            const result = await response.json();

            if (result.success) {
                // In real Easebuzz integration, we would redirect to result.payment.access_key URL
                // For mock, we show the mock URL
                alert(`Redirecting to Payment via ${paymentMethod}: ${result.payment.data || 'Mock URL'}`);
                if (typeof result.payment.data === 'string' && result.payment.data.startsWith('http')) {
                    window.location.href = result.payment.data;
                }
            } else {
                alert('Checkout failed: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-12 md:px-8 lg:px-16">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900">Secure Checkout</h1>

                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Left: Shipping Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-white p-8 shadow-sm border border-neutral-100">
                            <h2 className="mb-6 text-xl font-semibold text-neutral-800">Shipping Information</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600">First Name</label>
                                    <input
                                        type="text"
                                        value={address.firstname}
                                        onChange={e => setAddress({ ...address, firstname: e.target.value })}
                                        className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600">Last Name</label>
                                    <input type="text" className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-600">Email Address</label>
                                    <input type="email" className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-600">Phone Number</label>
                                    <input type="tel" className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-600">Street Address</label>
                                    <textarea className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" rows={2}></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600">City</label>
                                    <input type="text" className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-600">Pincode</label>
                                    <input type="text" className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm border border-neutral-100">
                            <h2 className="mb-6 text-xl font-semibold text-neutral-800">Payment Method</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="easebuzz"
                                        name="paymentMethod"
                                        type="radio"
                                        value="easebuzz"
                                        checked={paymentMethod === 'easebuzz'}
                                        onChange={() => setPaymentMethod('easebuzz')}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-neutral-300"
                                    />
                                    <label htmlFor="easebuzz" className="ml-3 block text-base font-medium text-neutral-700">
                                        Easebuzz
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="payu"
                                        name="paymentMethod"
                                        type="radio"
                                        value="payu"
                                        checked={paymentMethod === 'payu'}
                                        onChange={() => setPaymentMethod('payu')}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-neutral-300"
                                    />
                                    <label htmlFor="payu" className="ml-3 block text-base font-medium text-neutral-700">
                                        PayU
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === 'easebuzz' && (
                                <div className="mt-6 rounded-3xl bg-green-50 p-6 border border-green-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-green-600 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-900">Easebuzz Secure Payment</p>
                                        <p className="text-sm text-green-700">Encrypted and secure transactions. Supports Cards, UPI, Netbanking.</p>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'payu' && (
                                <div className="mt-6 rounded-3xl bg-blue-50 p-6 border border-blue-100 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v18Z"/><path d="M14 2v6h6"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-900">PayU Secure Payment</p>
                                        <p className="text-sm text-blue-700">Fast and reliable payments. Supports Cards, UPI, Netbanking, Wallets.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8 rounded-3xl bg-neutral-900 p-8 text-white shadow-xl shadow-neutral-200">
                            <h2 className="mb-8 text-xl font-semibold">Order Summary</h2>

                            <div className="space-y-6">
                                {MOCK_ITEMS.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-800">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-80" />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between py-1">
                                            <div>
                                                <p className="font-medium text-neutral-200">{item.title}</p>
                                                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 space-y-3 border-t border-neutral-800 pt-8">
                                <div className="flex justify-between text-sm text-neutral-400">
                                    <span>Subtotal</span>
                                    <span className="text-neutral-200">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-neutral-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400">FREE</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-2">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`mt-10 w-full rounded-2xl py-4 text-center text-lg font-bold transition-all shadow-lg ${isProcessing
                                        ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                        : 'bg-green-500 text-neutral-950 hover:bg-green-400 active:scale-95 shadow-green-500/20'
                                    }`}
                            >
                                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                            </button>

                            <p className="mt-6 text-center text-xs text-neutral-500">
                                By completing your purchase, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
