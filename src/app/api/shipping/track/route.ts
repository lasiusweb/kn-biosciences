import { NextResponse } from 'next/server';
import { LogisticsService } from '@/lib/integrations/logistics';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const awb = searchParams.get('awb');
    const platform = (searchParams.get('platform') as 'shiprocket' | 'delhivery') || 'shiprocket';

    if (!awb) {
        return NextResponse.json({ success: false, error: 'AWB is required' }, { status: 400 });
    }

    try {
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

        const trackingInfo = await logistics.trackShipment(awb, platform);
        return NextResponse.json({ success: true, tracking: trackingInfo });

    } catch (error: any) {
        console.error('[TRACKING_ERROR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
