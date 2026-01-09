import { POST as checkoutHandler } from '@/app/api/checkout/route';
import { POST as easebuzzWebhookHandler } from '@/app/api/webhooks/easebuzz/route';
import { POST as payuWebhookHandler } from '@/app/api/webhooks/payu/route';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Mock Supabase
const mockUpdate = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockSingle = jest.fn(() => Promise.resolve({ 
  data: { id: 'test_order_id', total_amount: 100, shipping_address: { email: 'test@example.com', phone: '1234567890' } }, 
  error: null 
}));

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { id: 'test_order_id' }, error: null })),
        })),
      })),
      update: mockUpdate,
      eq: mockEq,
      select: mockSelect,
      single: mockSingle,
    })),
  },
}));

// Mock Global Fetch
global.fetch = jest.fn();

// Mock Next.js Server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200
    })),
    redirect: jest.fn((url, init) => ({
      url,
      status: init?.status || 307
    })),
  },
}));

describe('End-to-End Checkout Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
    process.env.EASEBUZZ_MERCHANT_KEY = 'DKJ87SDJK763'; // Mock key for service to skip real fetch
    process.env.EASEBUZZ_SALT = 'test_salt';
    process.env.EASEBUZZ_ENV = 'test';
    process.env.PAYU_MERCHANT_KEY = 'payu_key';
    process.env.PAYU_SALT = 'payu_salt';
    process.env.PAYU_ENV = 'test';
  });

  describe('Easebuzz Flow', () => {
    it('should complete the Easebuzz flow from initiation to successful webhook', async () => {
      // 1. Initiation
      const checkoutReq = {
        json: () => Promise.resolve({
          items: [{ price: 50, quantity: 2 }],
          userId: 'user123',
          shippingAddress: { firstname: 'John', email: 'john@example.com', phone: '1234567890' },
          paymentMethod: 'easebuzz',
        }),
      } as Request;

      const checkoutRes = await checkoutHandler(checkoutReq);
      const checkoutData = await checkoutRes.json();
      expect(checkoutData.success).toBe(true);
      expect(checkoutData.payment.status).toBe('success');

      // 2. Webhook Callback
      const mockFormData = new FormData();
      mockFormData.append('txnid', 'test_order_id');
      mockFormData.append('status', 'success');
      mockFormData.append('easepayid', 'ease_id_123');
      mockFormData.append('hash', 'mock_valid_hash');

      const webhookReq = {
        formData: () => Promise.resolve(mockFormData),
      } as Request;

      await easebuzzWebhookHandler(webhookReq);

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        status: 'paid',
        payment_id: 'ease_id_123'
      }));
    });
  });

  describe('PayU Flow', () => {
    it('should complete the PayU flow from initiation to successful webhook', async () => {
      // 1. Initiation
      const checkoutReq = {
        json: () => Promise.resolve({
          items: [{ price: 100, quantity: 1 }],
          userId: 'user456',
          shippingAddress: { firstname: 'Jane', email: 'jane@example.com', phone: '0987654321' },
          paymentMethod: 'payu',
        }),
      } as Request;

      const checkoutRes = await checkoutHandler(checkoutReq);
      const checkoutData = await checkoutRes.json();
      expect(checkoutData.success).toBe(true);
      expect(checkoutData.payment.type).toBe('form_post');

      // 2. Webhook Callback
      const mockFormData = new FormData();
      mockFormData.append('txnid', 'test_order_id');
      mockFormData.append('status', 'success');
      mockFormData.append('mihpayid', 'payu_id_123');
      mockFormData.append('hash', 'mock_valid_hash');

      const webhookReq = {
        formData: () => Promise.resolve(mockFormData),
      } as Request;

      await payuWebhookHandler(webhookReq);

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        status: 'paid',
        payment_id: 'payu_id_123'
      }));
    });
  });
});
