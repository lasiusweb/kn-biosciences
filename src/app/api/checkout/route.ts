import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EasebuzzService } from '@/lib/integrations/easebuzz';

export async function POST(req: Request) {
    try {
        const { items, userId, shippingAddress, paymentMethod } = await req.json();

        // 1. Calculate total (In real app, fetch prices from DB)
        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        // 2. Create pending order in Supabase
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId,
                status: 'pending',
                total_amount: totalAmount,
                shipping_address: shippingAddress
            })
            .select()
            .single();

        if (orderError) throw orderError;

        let paymentResponseData;

        if (paymentMethod === 'easebuzz') {
            // 3. Initiate Easebuzz Payment
            const easebuzz = new EasebuzzService({
                merchantKey: process.env.EASEBUZZ_MERCHANT_KEY || '',
                salt: process.env.EASEBUZZ_SALT || '',
                env: (process.env.EASEBUZZ_ENV as 'test' | 'prod') || 'test'
            });

            const paymentResponse = await easebuzz.initiatePayment({
                txnid: order.id,
                amount: totalAmount.toFixed(2),
                productinfo: `Order #${order.id}`,
                firstname: shippingAddress.firstname || 'Customer',
                email: shippingAddress.email || 'customer@example.com',
                phone: shippingAddress.phone || '9999999999',
                surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/easebuzz?status=success`,
                furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/easebuzz?status=failure`
            });
            paymentResponseData = paymentResponse;
        } else if (paymentMethod === 'payu') {
            // Placeholder for PayU integration - will be implemented in a later task
            paymentResponseData = {
                success: true,
                data: 'mock_payu_url',
                msg: 'PayU payment initiated (mocked)'
            };
        } else {
            return NextResponse.json({ success: false, error: 'Unsupported payment method' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            payment: paymentResponseData
        });

    } catch (error: any) {
        console.error('[CHECKOUT_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
