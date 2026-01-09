import { LoggerService } from './logger';
import { supabaseAdmin } from './supabase';

// Mock Supabase
jest.mock('./supabase', () => {
  const mInsert = jest.fn(() => Promise.resolve({ error: null }));
  const mFrom = jest.fn(() => ({
    insert: mInsert,
  }));
  return {
    supabaseAdmin: {
      from: mFrom,
    },
  };
});

describe('LoggerService', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should log info to console and database', async () => {
    await LoggerService.info('test-source', 'test_event', { foo: 'bar' }, 'order-123');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] [test-source] test_event'),
      { foo: 'bar' }
    );

    expect(supabaseAdmin.from).toHaveBeenCalledWith('audit_logs');
    expect(supabaseAdmin.from('audit_logs').insert).toHaveBeenCalledWith(expect.objectContaining({
      level: 'info',
      source: 'test-source',
      event: 'test_event',
      details: { foo: 'bar' },
      order_id: 'order-123'
    }));
  });

  it('should log error to console and database', async () => {
    await LoggerService.error('test-source', 'error_event', { err: 'msg' });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] [test-source] error_event'),
      { err: 'msg' }
    );

    expect(supabaseAdmin.from('audit_logs').insert).toHaveBeenCalledWith(expect.objectContaining({
      level: 'error',
      source: 'test-source',
      event: 'error_event'
    }));
  });

  it('should sanitize sensitive keys from details', async () => {
    const sensitiveData = {
      orderId: '123',
      hash: 'secret-hash',
      apiKey: 'secret-key',
      user: {
        password: 'password123',
        email: 'test@example.com'
      }
    };

    await LoggerService.info('security-test', 'sensitive_event', sensitiveData);

    const expectedSanitized = {
      orderId: '123',
      hash: '[REDACTED]',
      apiKey: '[REDACTED]',
      user: {
        password: '[REDACTED]',
        email: 'test@example.com'
      }
    };

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('sensitive_event'),
      expectedSanitized
    );

    expect(supabaseAdmin.from('audit_logs').insert).toHaveBeenCalledWith(expect.objectContaining({
      details: expectedSanitized
    }));
  });
});