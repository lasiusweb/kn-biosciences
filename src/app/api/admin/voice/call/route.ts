import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/integrations/notifications';

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
        }

        const notifications = new NotificationService({
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID || '',
                authToken: process.env.TWILIO_AUTH_TOKEN || '',
                phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
            }
        });

        const result = await notifications.initiateCall(phone);

        if (result.success) {
            return NextResponse.json({ success: true, sid: result.sid });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[ADMIN_VOICE_CALL_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
