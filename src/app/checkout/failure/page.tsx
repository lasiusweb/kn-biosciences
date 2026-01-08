'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FailurePage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error') || 'Payment failed or was cancelled.';

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
                <p className="text-neutral-600 mb-8">{error}</p>
                <div className="space-y-4">
                    <Link 
                        href="/checkout"
                        className="block w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link 
                        href="/"
                        className="block w-full text-neutral-600 font-medium hover:text-neutral-900 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
