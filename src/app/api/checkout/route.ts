import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EasebuzzService } from '@/lib/integrations/easebuzz';
import { PayUService } from '@/lib/integrations/payu';
import { LoggerService } from '@/lib/logger';
import { CheckoutSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 0. Validation
        const validation = CheckoutSchema.safeParse(body);
        if (!validation.success) {
            await LoggerService.warn('checkout', 'validation_failed', { errors: validation.error.format() });
            return NextResponse.json({ success: false, error: 'Invalid request data', details: validation.error.format() }, { status: 400 });
        }

        const { items, userId, shippingAddress, paymentMethod } = validation.data;

        await LoggerService.info('checkout', 'order_initiation', { userId, paymentMethod, itemsCount: items.length });

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

        if (orderError) {
            await LoggerService.error('checkout', 'order_creation_failed', { error: orderError.message, userId });
            throw orderError;
        }

        await LoggerService.info('checkout', 'order_created', { orderId: order.id }, order.id);

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
            // 3. Initiate PayU Payment
            const payu = new PayUService({
                merchantKey: process.env.PAYU_MERCHANT_KEY || '',
                salt: process.env.PAYU_SALT || '',
                env: (process.env.PAYU_ENV as 'test' | 'prod') || 'test'
            });

            const paymentPayload = await payu.initiatePayment({
                txnid: order.id,
                amount: totalAmount.toFixed(2),
                productinfo: `Order #${order.id}`,
                firstname: shippingAddress.firstname || 'Customer',
                email: shippingAddress.email || 'customer@example.com',
                phone: shippingAddress.phone || '9999999999',
                surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/payu`,
                furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/payu`
            });
            
            paymentResponseData = {
                success: true,
                type: 'form_post', // Signal frontend to submit a form
                data: paymentPayload
            };
        } else {
            await LoggerService.warn('checkout', 'unsupported_payment_method', { paymentMethod, orderId: order.id }, order.id);
            return NextResponse.json({ success: false, error: 'Unsupported payment method' }, { status: 400 });
        }

        await LoggerService.info('checkout', 'checkout_completion', { orderId: order.id, paymentMethod }, order.id);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            payment: paymentResponseData
        });

    } catch (error: any) {
        await LoggerService.error('checkout', 'checkout_exception', { error: error.message });
        console.error('[CHECKOUT_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
