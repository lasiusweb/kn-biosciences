import crypto from 'crypto';
import { LoggerService } from '../logger';

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
    await LoggerService.info('easebuzz', 'initiation_started', { txnid: data.txnid, amount: data.amount }, data.txnid);

    if (this.config.merchantKey === 'DKJ87SDJK763') {
      console.log('[MOCK] Easebuzz: Initiating payment with mock keys');
      return {
        status: 'success',
        data: `${this.baseUrl}/payment/mock_checkout_url_${data.txnid}`,
        message: 'Mock payment URL generated'
      };
    }

    const hash = this.generateHash(data);
    
    const params = new URLSearchParams();
    params.append('key', this.config.merchantKey);
    params.append('txnid', data.txnid);
    params.append('amount', data.amount);
    params.append('productinfo', data.productinfo);
    params.append('firstname', data.firstname);
    params.append('email', data.email);
    params.append('phone', data.phone);
    params.append('surl', data.surl);
    params.append('furl', data.furl);
    params.append('hash', hash);

    try {
      const response = await fetch(`${this.baseUrl}/payment/initiate.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params.toString(),
      });

      const result = await response.json();

      if (result.status === 1) {
        await LoggerService.info('easebuzz', 'initiation_success', { access_key: result.data }, data.txnid);
        // Success: result.data is the access key
        return {
          status: 'success',
          data: `${this.baseUrl}/pay/${result.data}`,
          message: 'Payment URL generated successfully'
        };
      } else {
        await LoggerService.error('easebuzz', 'initiation_failed', { error: result.data }, data.txnid);
        // Error
        return {
          status: 'error',
          data: null,
          message: result.data || 'Failed to initiate payment'
        };
      }
    } catch (error: any) {
      await LoggerService.error('easebuzz', 'initiation_exception', { error: error.message }, data.txnid);
      console.error('[EASEBUZZ_INITIATE_ERROR]', error);
      return {
        status: 'error',
        data: null,
        message: error.message || 'Network error while initiating payment'
      };
    }
  }

  verifyWebhook(data: any, receivedHash: string): boolean {
    const hashString = `${this.config.salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${this.config.merchantKey}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    return calculatedHash === receivedHash;
  }
}
