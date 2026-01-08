import crypto from 'crypto';

export interface PayUConfig {
  merchantKey: string;
  salt: string;
  env: 'test' | 'prod';
}

export class PayUService {
  private config: PayUConfig;
  private baseUrl: string;

  constructor(config: PayUConfig) {
    this.config = config;
    this.baseUrl = config.env === 'prod' 
      ? 'https://secure.payu.in/_payment' 
      : 'https://test.payu.in/_payment';
  }

  private generateHash(data: any): string {
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|...|salt)
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
    const hash = this.generateHash(data);
    
    // PayU expects a form POST. Since we are in an API route, we can return the payload
    // and let the frontend create a hidden form and submit it, OR we can try to get a seamless payment link if supported.
    // For standard integration, we return the params and the URL to post to.
    
    // However, to align with the "redirect to gateway" pattern used in Easebuzz implementation (which fetched a URL),
    // and considering PayU standard checkout often involves a form POST from the browser.
    
    // Let's return the data needed for the form.
    
    return {
      key: this.config.merchantKey,
      txnid: data.txnid,
      amount: data.amount,
      productinfo: data.productinfo,
      firstname: data.firstname,
      email: data.email,
      phone: data.phone,
      surl: data.surl,
      furl: data.furl,
      hash: hash,
      action: this.baseUrl
    };
  }

  verifyWebhook(data: any, receivedHash: string): boolean {
    // Reverse hash: sha512(salt|status||||||udf5|udf4|...|email|firstname|productinfo|amount|txnid|key)
    
    // PayU sends empty strings for UDFs if not used.
    // The order of UDFs in reverse hash is udf5|udf4|udf3|udf2|udf1
    
    const hashString = `${this.config.salt}|${data.status}|||||||||||${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${this.config.merchantKey}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    return calculatedHash === receivedHash;
  }
}
