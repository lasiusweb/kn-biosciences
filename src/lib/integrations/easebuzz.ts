import crypto from 'crypto';

export interface EasebuzzConfig {
  merchantKey: string;
  salt: string;
  env: 'test' | 'prod';
}

export class EasebuzzService {
  private config: EasebuzzConfig;
  private baseUrl: string;

  constructor(config: EasebuzzConfig) {
    this.config = config;
    this.baseUrl = config.env === 'prod' 
      ? 'https://pay.easebuzz.in' 
      : 'https://testpay.easebuzz.in';
  }

  private generateHash(data: any): string {
    const hashString = `${this.config.merchantKey}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${this.config.salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  async initiatePayment(data: {
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
  }) {
    if (this.config.merchantKey === 'DKJ87SDJK763') {
      console.log('[MOCK] Easebuzz: Initiating payment with mock keys');
      return {
        status: 'success',
        data: `${this.baseUrl}/payment/mock_checkout_url_${data.txnid}`,
        message: 'Mock payment URL generated'
      };
    }

    const hash = this.generateHash(data);
    const payload = {
      ...data,
      key: this.config.merchantKey,
      hash: hash,
    };

    // In a real implementation, we would POST to Easebuzz and get the access key/URL
    // For now, we return the payload that would be sent to the checkout page
    return {
      status: 'success',
      data: payload,
      message: 'Payment credentials generated'
    };
  }

  verifyWebhook(data: any, receivedHash: string): boolean {
    const hashString = `${this.config.salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${this.config.merchantKey}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    return calculatedHash === receivedHash;
  }
}
