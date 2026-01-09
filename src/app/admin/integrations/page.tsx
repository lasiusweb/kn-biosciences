'use client';

import { useState } from 'react';

const INTEGRATIONS = [
    { name: 'Easebuzz', type: 'Payment', status: 'Healthy', icon: '💳' },
    { name: 'Shiprocket', type: 'Logistics', status: 'Healthy', icon: '🚚' },
    { name: 'Zoho Books', type: 'ERP', status: 'Healthy', icon: '📑' },
    { name: 'Twilio', type: 'Communications', status: 'Healthy', icon: '💬' },
];

const MOCK_ORDERS = [
    { id: 'ORD-54321', customer: 'Ramesh Kumar', phone: '9999999999', amount: '₹2,400', status: 'Paid', zoho: 'Linked', shipping: 'In Transit', notified: true },
    { id: 'ORD-54322', customer: 'Suresh Agrawal', phone: '8888888888', amount: '₹1,200', status: 'Paid', zoho: 'Linked', shipping: 'Pending', notified: true },
    { id: 'ORD-54323', customer: 'Anita Devi', phone: '7777777777', amount: '₹3,500', status: 'Pending', zoho: 'Pending', shipping: '-', notified: false },
];

export default function AdminIntegrationsPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [calling, setCalling] = useState<string | null>(null);

    const initiateCall = async (phone: string, orderId: string) => {
        setCalling(orderId);
        try {
            const response = await fetch('/api/admin/voice/call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const result = await response.json();
            if (result.success) {
                alert(`Call initiated! SID: ${result.sid}`);
            } else {
                alert(`Failed to initiate call: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while initiating the call.');
        } finally {
            setCalling(null);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Sidebar - Placeholder UI */}
            <div className="fixed left-0 top-0 h-full w-64 border-r border-stone-200 bg-white p-6 hidden lg:block">
                <div className="mb-10 text-xl font-bold text-stone-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
                    KN Bio Admin
                </div>
                <nav className="space-y-2">
                    {['Dashboard', 'Orders', 'Products', 'Integrations', 'Settings'].map(item => (
                        <button
                            key={item}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item === 'Integrations' ? 'bg-green-50 text-green-700' : 'text-stone-500 hover:bg-stone-50'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <main className="lg:ml-64 p-8 lg:p-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Third-Party Integrations</h1>
                        <p className="text-stone-500 mt-1">Manage connectivity and automated workflows.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-all shadow-sm">
                            Run Diagnostic
                        </button>
                        <button className="px-5 py-2.5 bg-stone-900 rounded-xl text-sm font-semibold text-white hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">
                            Update Settings
                        </button>
                    </div>
                </header>

                {/* Status Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {INTEGRATIONS.map(service => (
                        <div key={service.name} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{service.icon}</span>
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full ring-4 ring-green-50">
                                    {service.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-stone-900">{service.name}</h3>
                            <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">{service.type}</p>
                        </div>
                    ))}
                </div>

                {/* Orders Table */}
                <section className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                        <h2 className="font-bold text-stone-900">Automation Sync Status</h2>
                        <div className="flex gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-stone-500">Live Syncing</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4 text-center">Easepay Status</th>
                                    <th className="px-6 py-4 text-center">Zoho ERP</th>
                                    <th className="px-6 py-4 text-center">Logistics</th>
                                    <th className="px-6 py-4 text-center">Notify</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {MOCK_ORDERS.map(order => (
                                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-stone-900">{order.id}</td>
                                        <td className="px-6 py-5 text-stone-600">{order.customer}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`text-xs ${order.zoho === 'Linked' ? 'text-blue-600 font-medium' : 'text-stone-400'}`}>
                                                {order.zoho}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-xs text-stone-600 italic">
                                                {order.shipping}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className={`w-2 h-2 rounded-full mx-auto ${order.notified ? 'bg-green-500' : 'bg-stone-200'}`}></div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => initiateCall(order.phone, order.id)}
                                                    disabled={calling === order.id}
                                                    title="Initiate Voice Call"
                                                    className={`p-2 rounded-lg transition-colors ${calling === order.id ? 'text-green-500 bg-green-50' : 'text-stone-400 hover:text-green-600 hover:bg-green-50'}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.74 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                                </button>
                                                <button className="text-stone-400 hover:text-stone-900 transition-colors p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
                        <button className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-all">
                            View All Activity Log
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
