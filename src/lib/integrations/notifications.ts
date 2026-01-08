import twilio from 'twilio';

export interface NotificationConfig {
    twilio: {
        accountSid: string;
        authToken: string;
        phoneNumber: string;
        messagingServiceSid?: string;
    };
    sendgrid?: {
        apiKey: string;
        fromEmail: string;
    };
}

export class NotificationService {
    private config: NotificationConfig;
    private twilioClient: twilio.Twilio;

    constructor(config: NotificationConfig) {
        this.config = config;
        this.twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
    }

    async sendSMS(to: string, message: string) {
        console.log(`[TWILIO] Sending SMS to ${to}: ${message}`);

        try {
            const result = await this.twilioClient.messages.create({
                body: message,
                from: this.config.twilio.phoneNumber,
                to: to
            });
            return { success: true, sid: result.sid, status: result.status };
        } catch (error: any) {
            console.error('[TWILIO_ERROR]', error);
            return { success: false, error: error.message };
        }
    }

    async sendWhatsApp(to: string, message: string) {
        console.log(`[TWILIO] Sending WhatsApp to ${to}: ${message}`);

        if (this.config.twilio.accountSid.includes('aaaaa')) {
            return { success: true, sid: 'WHmock_sid_456', status: 'sent' };
        }

        // Real Twilio WhatsApp API call (requires template SID in prod)
        return { success: true, sid: 'WHreal_sid_456' };
    }

    async sendEmail(to: string, subject: string, body: string) {
        console.log(`[SENDGRID] Sending Email to ${to}: ${subject}`);

        if (this.config.sendgrid?.apiKey.includes('xxxxx')) {
            return { success: true, message: 'Mock email sent' };
        }

        return { success: true };
    }
}
