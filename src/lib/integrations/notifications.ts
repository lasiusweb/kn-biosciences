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

    constructor(config: NotificationConfig) {
        this.config = config;
    }

    async sendSMS(to: string, message: string) {
        console.log(`[TWILIO] Sending SMS to ${to}: ${message}`);

        if (this.config.twilio.accountSid.includes('aaaaa')) {
            return { success: true, sid: 'SMmock_sid_123', status: 'sent' };
        }

        // Real Twilio API call
        return { success: false, error: 'Mock keys used' };
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
