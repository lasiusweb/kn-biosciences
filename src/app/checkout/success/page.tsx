'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('txnid');

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Confirmed!</h1>
                <p className="text-neutral-600 mb-8">
                    Thank you for your purchase. Your order {orderId ? `#${orderId}` : ''} has been placed successfully.
                </p>
                <div className="space-y-4">
                    <Link 
                        href="/"
                        className="block w-full bg-green-500 text-neutral-950 py-4 rounded-2xl font-bold hover:bg-green-400 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
