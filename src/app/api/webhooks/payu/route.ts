import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PayUService } from '@/lib/integrations/payu';
import { ZohoService } from '@/lib/integrations/zoho';
import { LogisticsService } from '@/lib/integrations/logistics';
import { NotificationService } from '@/lib/integrations/notifications';
import { LoggerService } from '@/lib/logger';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        const receivedHash = data.hash as string;
        const orderId = data.txnid as string;

        await LoggerService.info('payu-webhook', 'webhook_received', { data, orderId }, orderId);

        const payu = new PayUService({
            merchantKey: process.env.PAYU_MERCHANT_KEY || '',
            salt: process.env.PAYU_SALT || '',
            env: (process.env.PAYU_ENV as 'test' | 'prod') || 'test'
        });

        // 1. Verify Webhook Authenticity
        const isValid = payu.verifyWebhook(data, receivedHash);
        
        // In PayU, hash mismatch usually means tampering.
        // We log it and optionally reject if in PROD.
        if (!isValid) {
             console.error('[PAYU_WEBHOOK] Invalid Hash Received', { data, receivedHash });
             await LoggerService.error('payu-webhook', 'invalid_hash', { receivedHash, orderId }, orderId);
             if (process.env.PAYU_ENV === 'prod') {
                 return NextResponse.json({ success: false, message: 'Invalid hash' }, { status: 400 });
             }
        }

        const paymentStatus = data.status as string; // 'success' or 'failure'
        
        // PayU sends 'mihpayid' as the payment identifier
        const paymentId = data.mihpayid as string;

        // 2. Update Order Status
        const { data: order, error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: paymentStatus === 'success' ? 'paid' : 'cancelled',
                payment_id: paymentId
            })
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) {
            await LoggerService.error('payu-webhook', 'order_update_failed', { error: updateError.message, orderId }, orderId);
            throw updateError;
        }

        await LoggerService.info('payu-webhook', 'order_status_updated', { status: order.status, orderId }, orderId);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

        if (paymentStatus === 'success') {
            // 3. Trigger Post-Payment Automations (Async)
            handlePostPayment(order);
            return NextResponse.redirect(`${baseUrl}/checkout/success?txnid=${orderId}`, { status: 303 });
        } else {
            const errorMsg = (data.error_Message as string) || 'Payment failed';
            await LoggerService.warn('payu-webhook', 'payment_failed_at_gateway', { error: errorMsg, orderId }, orderId);
            return NextResponse.redirect(`${baseUrl}/checkout/failure?txnid=${orderId}&error=${encodeURIComponent(errorMsg)}`, { status: 303 });
        }

    } catch (error: any) {
        await LoggerService.error('payu-webhook', 'webhook_exception', { error: error.message });
        console.error('[PAYU_WEBHOOK_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function handlePostPayment(order: any) {
    try {
        await LoggerService.info('payu-webhook', 'post_payment_automations_started', { orderId: order.id }, order.id);
        // Reuse same logic as Easebuzz for automations
        
        // A. Zoho Invoicing
        const zoho = new ZohoService({
            region: process.env.ZOHO_REGION || 'in',
            orgId: process.env.ZOHO_ORG_ID || '',
            clientId: process.env.ZOHO_CLIENT_ID || '',
            clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
            refreshToken: process.env.ZOHO_REFRESH_TOKEN || ''
        });
        const invoice = await zoho.createInvoice({ orderId: order.id, amount: order.total_amount });
        await LoggerService.info('payu-webhook', 'zoho_invoice_created', { invoiceId: invoice.invoice_id, orderId: order.id }, order.id);

        // B. Logistics Initiation (Default to Shiprocket)
        const logistics = new LogisticsService({
            shiprocket: {
                email: process.env.SHIPROCKET_EMAIL || '',
                password: process.env.SHIPROCKET_PASSWORD || ''
            }
        });
        const shipment = await logistics.createShipment({ orderId: order.id });
        await LoggerService.info('payu-webhook', 'logistics_shipment_created', { awb: shipment.awb, orderId: order.id }, order.id);

        // C. Update Order with Zoho and Logistics IDs
        await supabaseAdmin
            .from('orders')
            .update({
                zoho_invoice_id: invoice.invoice_id,
                shipping_awb: shipment.awb,
                status: 'processing'
            })
            .eq('id', order.id);

        // D. Notifications
        const notifications = new NotificationService({
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID || '',
                authToken: process.env.TWILIO_AUTH_TOKEN || '',
                phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
            }
        });

        const message = `Order Confirmed! Your Order #${order.id} is being processed. Invoice: ${invoice.invoice_number}, AWB: ${shipment.awb}`;
        await notifications.sendWhatsApp(order.shipping_address.phone, message);
        await notifications.sendEmail(order.shipping_address.email, 'Order Confirmation', message);
        await LoggerService.info('payu-webhook', 'post_payment_automations_completed', { orderId: order.id }, order.id);

    } catch (err: any) {
        await LoggerService.error('payu-webhook', 'post_payment_automation_failed', { error: err.message, orderId: order.id }, order.id);
        console.error('[POST_PAYMENT_AUTOMATION_FAILED]', err);
    }
}
