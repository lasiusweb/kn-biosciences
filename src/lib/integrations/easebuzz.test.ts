import { EasebuzzService } from './easebuzz';
import crypto from 'crypto';

describe('EasebuzzService', () => {
  const config = {
    merchantKey: 'test_key',
    salt: 'test_salt',
    env: 'test' as const,
  };

  let service: EasebuzzService;

  beforeEach(() => {
    service = new EasebuzzService(config);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate a correct hash', () => {
    const data = {
      txnid: 'order123',
      amount: '100.00',
      productinfo: 'Order #123',
      firstname: 'John',
      email: 'john@example.com',
      phone: '1234567890',
      surl: 'http://success.com',
      furl: 'http://failure.com',
    };

    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt)
    const expectedHashString = `test_key|order123|100.00|Order #123|John|john@example.com|||||||||||test_salt`;
    const expectedHash = crypto.createHash('sha512').update(expectedHashString).digest('hex');

    // Accessing private method for testing purpose or we can just test initiatePayment results
    const generatedHash = (service as any).generateHash(data);
    expect(generatedHash).toBe(expectedHash);
  });

  it('should initiate payment and return the access key URL', async () => {
    const mockAccessKey = 'mock_access_key_123';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        status: 1,
        data: mockAccessKey,
      }),
    });

    const data = {
      txnid: 'order123',
      amount: '100.00',
      productinfo: 'Order #123',
      firstname: 'John',
      email: 'john@example.com',
      phone: '1234567890',
      surl: 'http://success.com',
      furl: 'http://failure.com',
    };

    const result = await service.initiatePayment(data);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://testpay.easebuzz.in/payment/initiate.php',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      })
    );

    expect(result.status).toBe('success');
    expect(result.data).toBe(`https://testpay.easebuzz.in/pay/${mockAccessKey}`);
  });

  it('should handle API errors during payment initiation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        status: 0,
        data: 'Invalid Key',
      }),
    });

    const data = {
        txnid: 'order123',
        amount: '100.00',
        productinfo: 'Order #123',
        firstname: 'John',
        email: 'john@example.com',
        phone: '1234567890',
        surl: 'http://success.com',
        furl: 'http://failure.com',
      };

    const result = await service.initiatePayment(data);

    expect(result.status).toBe('error');
    expect(result.message).toBe('Invalid Key');
  });
});
