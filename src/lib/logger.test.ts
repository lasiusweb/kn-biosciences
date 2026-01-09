import { LoggerService } from './logger';
import { supabaseAdmin } from './supabase';

// Mock Supabase
jest.mock('./supabase', () => {
  const mockInsert = jest.fn(() => Promise.resolve({ error: null }));
  const mockFrom = jest.fn(() => ({
    insert: mockInsert,
  }));
  return {
    supabaseAdmin: {
      from: mockFrom,
    },
  };
});

import { LoggerService } from './logger';
import { supabaseAdmin } from './supabase';

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

  it('should log warn to console and database', async () => {
    await LoggerService.warn('test-source', 'warn_event');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[WARN] [test-source] warn_event'),
      ''
    );

    expect(supabaseAdmin.from('audit_logs').insert).toHaveBeenCalledWith(expect.objectContaining({
      level: 'warn',
      source: 'test-source',
      event: 'warn_event'
    }));
  });
});
