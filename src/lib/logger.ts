import { supabaseAdmin } from './supabase';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  source: string;
  event: string;
  details?: any;
  order_id?: string;
  user_id?: string;
}

export class LoggerService {
  static async log(entry: LogEntry) {
    const { level, source, event, details, order_id, user_id } = entry;

    // 1. Console Logging
    const timestamp = new Date().toISOString();
    const consoleMsg = `[${timestamp}] [${level.toUpperCase()}] [${source}] ${event}`;
    
    if (level === 'error') {
      console.error(consoleMsg, details || '');
    } else if (level === 'warn') {
      console.warn(consoleMsg, details || '');
    } else {
      console.log(consoleMsg, details || '');
    }

    // 2. Database Logging (Persistent Audit Trail)
    try {
      const { error } = await supabaseAdmin
        .from('audit_logs')
        .insert({
          level,
          source,
          event,
          details,
          order_id,
          user_id
        });

      if (error) {
        console.error('[LOGGER_DB_ERROR]', error);
      }
    } catch (err) {
      console.error('[LOGGER_EXCEPTION]', err);
    }
  }

  static async info(source: string, event: string, details?: any, order_id?: string) {
    return this.log({ level: 'info', source, event, details, order_id });
  }

  static async warn(source: string, event: string, details?: any, order_id?: string) {
    return this.log({ level: 'warn', source, event, details, order_id });
  }

  static async error(source: string, event: string, details?: any, order_id?: string) {
    return this.log({ level: 'error', source, event, details, order_id });
  }
}
