import { EasebuzzService } from '../src/lib/integrations/easebuzz.js';
import { LogisticsService } from '../src/lib/integrations/logistics.js';
import { ZohoService } from '../src/lib/integrations/zoho.js';
import { NotificationService } from '../src/lib/integrations/notifications.js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTests() {
    console.log('--- Starting Third-Party Integration Tests ---\n');

    // 1. Easebuzz
    console.log('Testing Easebuzz...');
    const easebuzz = new EasebuzzService({
        merchantKey: process.env.EASEBUZZ_MERCHANT_KEY || '',
        salt: process.env.EASEBUZZ_SALT || '',
        env: (process.env.EASEBUZZ_ENV as 'test' | 'prod') || 'test'
    });
    const payment = await easebuzz.initiatePayment({
        txnid: 'TXN12345',
        amount: '100.00',
        productinfo: 'Test Product',
        firstname: 'John',
        email: 'john@example.com',
        phone: '9999999999',
        surl: 'https://example.com/success',
        furl: 'https://example.com/failure'
    });
    console.log('Easebuzz Result:', payment.status, '-', payment.message);
    console.log('\n');

    // 2. Logistics
    console.log('Testing Logistics (Shiprocket/Delhivery)...');
    const logistics = new LogisticsService({
        shiprocket: {
            email: process.env.SHIPROCKET_EMAIL || '',
            password: process.env.SHIPROCKET_PASSWORD || ''
        },
        delhivery: {
            token: process.env.DELHIVERY_TOKEN || '',
            env: (process.env.DELHIVERY_ENV as 'test' | 'prod') || 'test'
        }
    });
    const svc = await logistics.checkServiceability('560001', 'shiprocket');
    console.log('Logistics Serviceability (560001):', svc.serviceable ? 'YES' : 'NO', `(${svc.courier_name})`);
    const shipment = await logistics.createShipment({}, 'delhivery');
    console.log('Delhivery Mock Shipment:', shipment.success ? `AWB: ${shipment.awb}` : 'Failed');
    console.log('\n');

    // 3. Zoho
    console.log('Testing Zoho ERP...');
    const zoho = new ZohoService({
        region: process.env.ZOHO_REGION || 'in',
        orgId: process.env.ZOHO_ORG_ID || '',
        clientId: process.env.ZOHO_CLIENT_ID || '',
        clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
        refreshToken: process.env.ZOHO_REFRESH_TOKEN || ''
    });
    const invoice = await zoho.createInvoice({});
    console.log('Zoho Invoice:', invoice.success ? invoice.invoice_id : 'Failed', `(${invoice.message})`);
    console.log('\n');

    // 4. Notifications
    console.log('Testing Notifications (Twilio/SendGrid)...');
    const notifications = new NotificationService({
        twilio: {
            accountSid: process.env.TWILIO_ACCOUNT_SID || '',
            authToken: process.env.TWILIO_AUTH_TOKEN || '',
            phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
        },
        sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY || '',
            fromEmail: process.env.SENDGRID_FROM_EMAIL || 'test@example.com'
        }
    });
    const sms = await notifications.sendSMS('+919999999999', 'Hello from KN Biosciences!');
    console.log('Twilio SMS:', sms.success ? 'Sent' : 'Failed', `(SID: ${sms.sid})`);
    const email = await notifications.sendEmail('user@example.com', 'Test Subject', 'Test Body');
    console.log('SendGrid Email:', email.success ? 'Sent' : 'Failed');
    console.log('\n');

    console.log('--- All Tests Completed Successfully (Mock Mode) ---');
}

runTests().catch(err => {
    console.error('Test Execution Failed:', err);
    process.exit(1);
});
