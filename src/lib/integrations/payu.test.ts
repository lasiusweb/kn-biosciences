import { PayUService } from './payu';
import crypto from 'crypto';

describe('PayUService', () => {
  const config = {
    merchantKey: 'payu_test_key',
    salt: 'payu_test_salt',
    env: 'test' as const,
  };

  let service: PayUService;

  beforeEach(() => {
    service = new PayUService(config);
    // Mock global fetch if PayU service uses it directly, 
    // or we can test the form data generation if it returns a form/payload.
    // For PayU, often a form post is used. Let's assume initiatePayment returns payload for form.
  });

  it('should generate a correct hash for payment', () => {
    const data = {
      txnid: 'order456',
      amount: '200.00',
      productinfo: 'Order #456',
      firstname: 'Jane',
      email: 'jane@example.com',
      phone: '0987654321',
      surl: 'http://success.com',
      furl: 'http://failure.com',
    };

    // PayU Hash: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|...|salt)
    const hashString = `payu_test_key|order456|200.00|Order #456|Jane|jane@example.com|||||||||||payu_test_salt`;
    const expectedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Accessing private/protected method if needed, or testing public method result
    const generatedHash = (service as any).generateHash(data);
    expect(generatedHash).toBe(expectedHash);
  });

  it('should return correct payment payload with hash', async () => {
    const data = {
      txnid: 'order456',
      amount: '200.00',
      productinfo: 'Order #456',
      firstname: 'Jane',
      email: 'jane@example.com',
      phone: '0987654321',
      surl: 'http://success.com',
      furl: 'http://failure.com',
    };

    const result = await service.initiatePayment(data);

    expect(result.key).toBe('payu_test_key');
    expect(result.txnid).toBe('order456');
    expect(result.amount).toBe('200.00');
    expect(result.hash).toBeDefined();
    
    const expectedHash = (service as any).generateHash(data);
    expect(result.hash).toBe(expectedHash);
  });

  it('should verify webhook hash correctly', () => {
    // Reverse hash for verification: sha512(salt|status||||||udf5|udf4|...|email|firstname|productinfo|amount|txnid|key)
    const responseData = {
      status: 'success',
      firstname: 'Jane',
      amount: '200.00',
      txnid: 'order456',
      productinfo: 'Order #456',
      email: 'jane@example.com',
      key: 'payu_test_key',
      // ... other fields empty/udf
    };

    const hashString = `payu_test_salt|success|||||||||||jane@example.com|Jane|Order #456|200.00|order456|payu_test_key`;
    const validHash = crypto.createHash('sha512').update(hashString).digest('hex');

    const isValid = service.verifyWebhook(responseData, validHash);
    expect(isValid).toBe(true);
  });

  it('should fail verification with incorrect hash', () => {
    const responseData = {
      status: 'success',
      firstname: 'Jane',
      amount: '200.00',
      txnid: 'order456',
      productinfo: 'Order #456',
      email: 'jane@example.com',
      key: 'payu_test_key',
    };

    const isValid = service.verifyWebhook(responseData, 'invalid_hash_string');
    expect(isValid).toBe(false);
  });
});
