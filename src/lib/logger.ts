export class Logger {
  static info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data || '');
    // Add your logging service here (e.g., Sentry, LogRocket)
  }

  static error(message: string, error?: Error, extra?: any) {
    console.error(`[ERROR] ${message}`, { error, ...extra });
    // Add your error tracking here
  }

  static warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data || '');
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}
