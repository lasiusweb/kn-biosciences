// src/app/api/webhooks/payu/route.test.ts
import { POST } from './route';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PayUService } from '@/lib/integrations/payu';

// Mock all external modules
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url, init?: ResponseInit) => ({
      url,
      status: init?.status || 307
    })),
    json: jest.fn((data, init?: ResponseInit) => ({
        json: () => Promise.resolve(data),
        status: init?.status || 200
    })),
  },
}));

const mockUpdate = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockSingle = jest.fn(() => Promise.resolve({ 
  data: { id: 'mock_order_id', total_amount: 200 }, 
  error: null 
}));

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      update: mockUpdate,
      eq: mockEq,
      single: mockSingle,
    })),
  },
}));

const mockVerifyWebhook = jest.fn().mockReturnValue(true);
jest.mock('@/lib/integrations/payu', () => ({
  PayUService: jest.fn().mockImplementation(() => ({
    verifyWebhook: mockVerifyWebhook,
  })),
}));

describe('PayU Webhook API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PAYU_MERCHANT_KEY = 'test_key';
    process.env.PAYU_SALT = 'test_salt';
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
    mockVerifyWebhook.mockReturnValue(true);
  });

  it('should update order status to paid on success and redirect', async () => {
    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'success');
    mockFormData.append('mihpayid', 'mock_payu_id');
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
      payment_id: 'mock_payu_id',
    }));
  });

  it('should update order status to cancelled on failure and redirect', async () => {
    const mockFormData = new FormData();
    mockFormData.append('txnid', 'mock_order_id');
    mockFormData.append('status', 'failure');
    mockFormData.append('mihpayid', 'mock_payu_id');
    mockFormData.append('hash', 'mock_valid_hash');
    mockFormData.append('error_Message', 'Bank declined');

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
      payment_id: 'mock_payu_id',
    }));
  });
});
