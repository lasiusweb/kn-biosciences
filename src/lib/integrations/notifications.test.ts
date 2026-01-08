import { NotificationService } from './notifications';

// Mock the twilio module
jest.mock('twilio', () => {
  const mMessages = {
    create: jest.fn().mockResolvedValue({ sid: 'SM_mock_real_sid', status: 'sent' }),
  };
  const mCalls = {
    create: jest.fn().mockResolvedValue({ sid: 'CA_mock_call_sid', status: 'queued' }),
  };
  return jest.fn(() => ({
    messages: mMessages,
    calls: mCalls,
  }));
});

describe('NotificationService', () => {
  const config = {
    twilio: {
      accountSid: 'real_sid',
      authToken: 'real_token',
      phoneNumber: '+1234567890',
    }
  };

  let service: NotificationService;
  let twilioMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationService(config);
    twilioMock = require('twilio');
  });

  it('should call Twilio API for order confirmation SMS', async () => {
    const to = '9999999999';
    const message = 'Order Confirmed!';
    
    await service.sendSMS(to, message);

    const clientInstance = twilioMock.mock.results[0].value;
    expect(clientInstance.messages.create).toHaveBeenCalledWith(expect.objectContaining({
      body: message,
      from: config.twilio.phoneNumber,
      to: to
    }));
  });

  it('should call Twilio API for order status update SMS', async () => {
    const to = '9999999999';
    const message = 'Your Order #123 is now Shipped.';
    
    await service.sendSMS(to, message);

    const clientInstance = twilioMock.mock.results[0].value;
    expect(clientInstance.messages.create).toHaveBeenCalledWith(expect.objectContaining({
      body: message,
      from: config.twilio.phoneNumber,
      to: to
    }));
  });

  it('should call Twilio API to initiate a voice call', async () => {
    const to = '9999999999';
    
    await service.initiateCall(to);

    const clientInstance = twilioMock.mock.results[0].value;
    expect(clientInstance.calls.create).toHaveBeenCalledWith(expect.objectContaining({
      to: to,
      from: config.twilio.phoneNumber,
      url: expect.stringContaining('voice.xml'), // Expecting some TwiML URL or logic
    }));
  });
});
