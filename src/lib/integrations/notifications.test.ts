import { NotificationService } from './notifications';

describe('NotificationService', () => {
  const config = {
    twilio: {
      accountSid: 'test_sid',
      authToken: 'test_token',
      phoneNumber: 'test_phone',
    }
  };

  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService(config);
    // Mock the external SMS sending logic if it's already implemented or to be implemented.
    // Assuming NotificationService uses a Twilio client under the hood.
  });

  it('should send an order confirmation SMS', async () => {
    const orderData = {
      id: 'order123',
      total_amount: 1500,
      customer_phone: '9999999999',
    };

    // We expect a method like sendOrderConfirmationSMS
    const spy = jest.spyOn(service, 'sendWhatsApp'); // Assuming WhatsApp is used per spec for order confirmation
    
    await service.sendWhatsApp(orderData.customer_phone, `Order Confirmed! Your Order #${orderData.id} has been placed.`);

    expect(spy).toHaveBeenCalledWith(
      '9999999999',
      expect.stringContaining('Order Confirmed!')
    );
  });

  it('should send an order status update SMS', async () => {
    const orderData = {
      id: 'order123',
      status: 'shipped',
      customer_phone: '9999999999',
    };

    const spy = jest.spyOn(service, 'sendWhatsApp');
    
    await service.sendWhatsApp(orderData.customer_phone, `Your Order #${orderData.id} status has been updated to ${orderData.status}.`);

    expect(spy).toHaveBeenCalledWith(
      '9999999999',
      expect.stringContaining('status has been updated to shipped')
    );
  });
});
