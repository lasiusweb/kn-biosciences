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
    json: jest.fn((data, init?: ResponseInit) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200
    })),
    redirect: jest.fn((url, init?: ResponseInit) => ({
      url,
      status: init?.status || 307
    })),
  },
}));

const mockUpdate = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockSingle = jest.fn(() => Promise.resolve({ 
  data: { 
    id: 'mock_order_id', 
    total_amount: 100, 
    shipping_address: { email: 'test@example.com', phone: '1234567890' } 
  }, 
  error: null 
}));

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      update: mockUpdate,
      eq: mockEq,
      select: mockSelect,
      single: mockSingle,
    })),
  },
}));

const mockVerifyWebhook = jest.fn().mockReturnValue(true);
jest.mock('@/lib/integrations/easebuzz', () => ({
  EasebuzzService: jest.fn().mockImplementation(() => ({
    verifyWebhook: mockVerifyWebhook,
  })),
}));

const mockCreateInvoice = jest.fn(() => Promise.resolve({ invoice_id: 'mock_invoice_id', invoice_number: 'INV-001' }));
jest.mock('@/lib/integrations/zoho', () => ({
  ZohoService: jest.fn().mockImplementation(() => ({
    createInvoice: mockCreateInvoice,
  })),
}));

const mockCreateShipment = jest.fn(() => Promise.resolve({ awb: 'mock_awb_123' }));
jest.mock('@/lib/integrations/logistics', () => ({
  LogisticsService: jest.fn().mockImplementation(() => ({
    createShipment: mockCreateShipment,
  })),
}));

const mockSendWhatsApp = jest.fn();
const mockSendEmail = jest.fn();
jest.mock('@/lib/integrations/notifications', () => ({
  NotificationService: jest.fn().mockImplementation(() => ({
    sendWhatsApp: mockSendWhatsApp,
    sendEmail: mockSendEmail,
  })),
}));


describe('Easebuzz Webhook API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EASEBUZZ_MERCHANT_KEY = 'test_key';
    process.env.EASEBUZZ_SALT = 'test_salt';
    process.env.EASEBUZZ_ENV = 'test';
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
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
    
    mockVerifyWebhook.mockReturnValue(true);
  });

  it('should update order status to paid and trigger post-payment automations on success', async () => {
    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'success');
    mockFormData.append('easepayid', 'mock_easepay_id');
    mockFormData.append('hash', 'mock_valid_hash');

    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    } as Request;

    const response = await POST(mockRequest);
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining('/checkout/success?txnid=mock_order_id'),
      { status: 303 }
    );
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      status: 'paid',
      payment_id: 'mock_easepay_id',
    }));
    expect(mockEq).toHaveBeenCalledWith('id', 'mock_order_id');
    
    // We can't easily check for async post-payment results here because handlePostPayment is not awaited
    // but we can at least check if the POST response was successful.
  });

  it('should update order status to cancelled on failure', async () => {
    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'failure');
    mockFormData.append('easepayid', 'mock_easepay_id');
    mockFormData.append('hash', 'mock_valid_hash');

    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    } as Request;

    const response = await POST(mockRequest);
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining('/checkout/failure?txnid=mock_order_id'),
      { status: 303 }
    );
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      status: 'cancelled',
      payment_id: 'mock_easepay_id',
    }));
  });

  it('should return 400 for invalid hash in production', async () => {
    process.env.EASEBUZZ_ENV = 'prod';
    mockVerifyWebhook.mockReturnValueOnce(false);

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