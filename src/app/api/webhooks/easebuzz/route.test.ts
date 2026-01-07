// src/app/api/webhooks/easebuzz/route.test.ts
import { POST } from './route';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EasebuzzService } from '@/lib/integrations/easebuzz';
import { ZohoService } from '@/lib/integrations/zoho';
import { LogisticsService } from '@/lib/integrations/logistics';
import { NotificationService } from '@/lib/integrations/notifications';

// Mock all external modules
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(data => ({
      json: () => Promise.resolve(data),
      status: data.status || 200
    })),
  },
}));
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: { id: 'mock_order_id', total_amount: 100, shipping_address: { email: 'test@example.com', phone: '1234567890' } }, error: null })),
          })),
        })),
      })),
    })),
  },
}));
jest.mock('@/lib/integrations/easebuzz', () => ({
  EasebuzzService: jest.fn().mockImplementation(() => ({
    verifyWebhook: jest.fn((data, hash) => true), // Mock successful verification
  })),
}));
jest.mock('@/lib/integrations/zoho', () => ({
  ZohoService: jest.fn().mockImplementation(() => ({
    createInvoice: jest.fn(() => ({ invoice_id: 'mock_invoice_id', invoice_number: 'INV-001' })),
  })),
}));
jest.mock('@/lib/integrations/logistics', () => ({
  LogisticsService: jest.fn().mockImplementation(() => ({
    createShipment: jest.fn(() => ({ awb: 'mock_awb_123' })),
  })),
}));
jest.mock('@/lib/integrations/notifications', () => ({
  NotificationService: jest.fn().mockImplementation(() => ({
    sendWhatsApp: jest.fn(),
    sendEmail: jest.fn(),
  })),
}));


describe('Easebuzz Webhook API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EASEBUZZ_MERCHANT_KEY = 'test_key';
    process.env.EASEBUZZ_SALT = 'test_salt';
    process.env.EASEBUZZ_ENV = 'test'; // Ensure webhook verification is not skipped in test env
    process.env.ZOHO_REGION = 'in';
    process.env.ZOHO_ORG_ID = 'test_org';
    process.env.ZOHO_CLIENT_ID = 'test_client';
    process.env.ZOHO_CLIENT_SECRET = 'test_secret';
    process.env.ZOHO_REFRESH_TOKEN = 'test_refresh';
    process.env.SHIPROCKET_EMAIL = 'test@ship.com';
    process.env.SHIPROCKET_PASSWORD = 'password';
    process.env.TWILIO_ACCOUNT_SID = 'test_sid';
    process.env.TWILIO_AUTH_TOKEN = 'test_token';
    process.env.TWILIO_PHONE_NUMBER = 'test_phone';
  });

  it('should update order status to paid and trigger post-payment automations on success', async () => {
    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'success');
    mockFormData.append('easepayid', 'mock_easepay_id');
    mockFormData.append('hash', 'mock_valid_hash'); // Mocked to be valid

    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.success).toBe(true);
    expect(supabaseAdmin.from().update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'paid',
      payment_id: 'mock_easepay_id',
    }));
    expect(supabaseAdmin.from().update().eq).toHaveBeenCalledWith('id', 'mock_order_id');
    
    // Check if post-payment automations were called
    expect(ZohoService).toHaveBeenCalled();
    expect(LogisticsService).toHaveBeenCalled();
    expect(NotificationService).toHaveBeenCalled();
    expect(NotificationService.mock.instances[0].sendWhatsApp).toHaveBeenCalled();
    expect(NotificationService.mock.instances[0].sendEmail).toHaveBeenCalled();
  });

  it('should update order status to cancelled on failure', async () => {
    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'failure');
    mockFormData.append('easepayid', 'mock_easepay_id');
    mockFormData.append('hash', 'mock_valid_hash'); // Mocked to be valid

    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.success).toBe(true);
    expect(supabaseAdmin.from().update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'cancelled',
      payment_id: 'mock_easepay_id',
    }));
    expect(ZohoService).not.toHaveBeenCalled(); // No post-payment automations on failure
  });

  it('should return 400 for invalid hash in production', async () => {
    process.env.EASEBUZZ_ENV = 'prod';
    EasebuzzService.mock.instances[0].verifyWebhook.mockReturnValueOnce(false); // Mock invalid hash

    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'success');
    mockFormData.append('easepayid', 'mock_easepay_id');
    mockFormData.append('hash', 'mock_invalid_hash');

    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(response.status).toBe(400);
  });
});
