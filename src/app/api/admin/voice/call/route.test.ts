// src/app/api/admin/voice/call/route.test.ts
import { POST } from './route';
import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/integrations/notifications';

// Mock NotificationService
const mockInitiateCall = jest.fn();
jest.mock('@/lib/integrations/notifications', () => ({
  NotificationService: jest.fn().mockImplementation(() => ({
    initiateCall: mockInitiateCall,
  })),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init?: ResponseInit) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200
    })),
  },
}));

describe('Admin Voice Call API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TWILIO_ACCOUNT_SID = 'test_sid';
    process.env.TWILIO_AUTH_TOKEN = 'test_token';
    process.env.TWILIO_PHONE_NUMBER = 'test_phone';
  });

  it('should return 400 if phone number is missing', async () => {
    const mockRequest = {
      json: () => Promise.resolve({}),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Phone number is required');
  });

  it('should successfully initiate a call and return sid', async () => {
    mockInitiateCall.mockResolvedValueOnce({ success: true, sid: 'CA123' });

    const mockRequest = {
      json: () => Promise.resolve({ phone: '9999999999' }),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.sid).toBe('CA123');
    expect(mockInitiateCall).toHaveBeenCalledWith('9999999999');
  });

  it('should return 500 if NotificationService fails', async () => {
    mockInitiateCall.mockResolvedValueOnce({ success: false, error: 'Twilio API Error' });

    const mockRequest = {
      json: () => Promise.resolve({ phone: '9999999999' }),
    } as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Twilio API Error');
  });
});
