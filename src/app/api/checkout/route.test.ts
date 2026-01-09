// src/app/api/checkout/route.test.ts
import { POST } from './route';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EasebuzzService } from '@/lib/integrations/easebuzz';

// Mock LoggerService
jest.mock('@/lib/logger', () => ({
  LoggerService: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Next.js and Supabase
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init?: ResponseInit) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200
    })),
  },
}));
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: { id: 'mock_order_id', total_amount: 100, shipping_address: {} }, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: { id: 'mock_order_id', total_amount: 100, shipping_address: {} }, error: null })),
          })),
        })),
      })),
    })),
  },
}));

// Mock EasebuzzService
const mockEasebuzzInitiatePayment = jest.fn(() => ({
  data: 'mock_easebuzz_url',
  status: 'success',
  error_message: null
}));
jest.mock('@/lib/integrations/easebuzz', () => {
  return {
    EasebuzzService: jest.fn().mockImplementation(() => ({
      initiatePayment: mockEasebuzzInitiatePayment,
    })),
  };
});

// Mock PayUService
const mockPayUInitiatePayment = jest.fn(() => ({
  action: 'https://test.payu.in/_payment',
  key: 'payu_key',
  hash: 'mock_hash',
}));
jest.mock('@/lib/integrations/payu', () => {
  return {
    PayUService: jest.fn().mockImplementation(() => ({
      initiatePayment: mockPayUInitiatePayment,
    })),
  };
});

describe('Checkout API Route - Easebuzz Initiation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEasebuzzInitiatePayment.mockClear();
    mockPayUInitiatePayment.mockClear();
    process.env.EASEBUZZ_MERCHANT_KEY = 'test_key';
    process.env.EASEBUZZ_SALT = 'test_salt';
    process.env.EASEBUZZ_ENV = 'test';
    process.env.PAYU_MERCHANT_KEY = 'payu_key';
    process.env.PAYU_SALT = 'payu_salt';
    process.env.PAYU_ENV = 'test';
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
  });

  it('should initiate Easebuzz payment when paymentMethod is easebuzz', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        items: [{ price: 50, quantity: 2 }],
        userId: 'user123',
        shippingAddress: { firstname: 'John', email: 'john@example.com', phone: '1234567890' },
        paymentMethod: 'easebuzz',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(EasebuzzService).toHaveBeenCalledWith(expect.objectContaining({
      merchantKey: 'test_key',
      salt: 'test_salt',
      env: 'test'
    }));
    expect(mockEasebuzzInitiatePayment).toHaveBeenCalledWith(expect.objectContaining({
      txnid: 'mock_order_id',
      amount: '100.00',
      productinfo: 'Order #mock_order_id',
      surl: 'http://localhost:3000/api/webhooks/easebuzz?status=success',
      furl: 'http://localhost:3000/api/webhooks/easebuzz?status=failure'
    }));
    expect(result.success).toBe(true);
    expect(result.payment.data).toBe('mock_easebuzz_url');
  });

  it('should return error if order creation fails', async () => {
    supabaseAdmin.from.mockImplementationOnce(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: null, error: { message: 'DB Error' } })),
        })),
      })),
    }));

    const mockRequest = {
      json: () => Promise.resolve({
        items: [{ price: 50, quantity: 2 }],
        userId: 'user123',
        shippingAddress: {},
        paymentMethod: 'easebuzz',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB Error');
    expect(response.status).toBe(500); // Now checking the status from the mock directly
  });

  it('should initiate PayU payment when paymentMethod is payu', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        items: [{ price: 100, quantity: 1 }],
        userId: 'user456',
        shippingAddress: { firstname: 'Jane', email: 'jane@example.com', phone: '0987654321' },
        paymentMethod: 'payu',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result.success).toBe(true);
    expect(result.payment.type).toBe('form_post');
    expect(result.payment.data).toEqual(expect.objectContaining({
      key: 'payu_key',
      hash: 'mock_hash',
      action: 'https://test.payu.in/_payment'
    }));
  });
});
