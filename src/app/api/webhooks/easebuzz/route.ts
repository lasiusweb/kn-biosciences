import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EasebuzzService } from '@/lib/integrations/easebuzz';
import { ZohoService } from '@/lib/integrations/zoho';
import { LogisticsService } from '@/lib/integrations/logistics';
import { NotificationService } from '@/lib/integrations/notifications';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());
        const receivedHash = data.hash as string;

        const easebuzz = new EasebuzzService({
            merchantKey: process.env.EASEBUZZ_MERCHANT_KEY || '',
            salt: process.env.EASEBUZZ_SALT || '',
            env: (process.env.EASEBUZZ_ENV as 'test' | 'prod') || 'test'
        });

        // 1. Verify Webhook Authenticity
        const isValid = easebuzz.verifyWebhook(data, receivedHash);
        if (!isValid && process.env.EASEBUZZ_ENV === 'prod') {
            return NextResponse.json({ success: false, message: 'Invalid hash' }, { status: 400 });
        }

        const orderId = data.txnid as string;
        const paymentStatus = data.status as string; // 'success' or 'failure'

        // 2. Update Order Status
        const { data: order, error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: paymentStatus === 'success' ? 'paid' : 'cancelled',
                payment_id: data.easepayid as string
            })
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) throw updateError;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

        if (paymentStatus === 'success') {
            // 3. Trigger Post-Payment Automations (Async)
            handlePostPayment(order);
            return NextResponse.redirect(`${baseUrl}/checkout/success?txnid=${orderId}`, { status: 303 });
        } else {
            return NextResponse.redirect(`${baseUrl}/checkout/failure?txnid=${orderId}&error=Payment+failed`, { status: 303 });
        }

    } catch (error: any) {
        console.error('[WEBHOOK_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function handlePostPayment(order: any) {
    try {
        // A. Zoho Invoicing
        const zoho = new ZohoService({
            region: process.env.ZOHO_REGION || 'in',
            orgId: process.env.ZOHO_ORG_ID || '',
            clientId: process.env.ZOHO_CLIENT_ID || '',
            clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
            refreshToken: process.env.ZOHO_REFRESH_TOKEN || ''
        });
        const invoice = await zoho.createInvoice({ orderId: order.id, amount: order.total_amount });

        // B. Logistics Initiation (Default to Shiprocket)
        const logistics = new LogisticsService({
            shiprocket: {
                email: process.env.SHIPROCKET_EMAIL || '',
                password: process.env.SHIPROCKET_PASSWORD || ''
            }
        });
        const shipment = await logistics.createShipment({ orderId: order.id });

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

    } catch (err) {
        console.error('[POST_PAYMENT_AUTOMATION_FAILED]', err);
    }
}
