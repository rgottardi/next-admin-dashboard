import pino from 'pino';

// Initialize logger with a simpler configuration that works with Next.js
export const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  browser: {
    write: {
      info: (...args) => console.info(...args),
      error: (...args) => console.error(...args),
      debug: (...args) => console.debug(...args),
      warn: (...args) => console.warn(...args),
    },
  },
});

// Custom error class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public meta?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler utility
export const handleError = (error: unknown, context?: string) => {
  if (error instanceof AppError) {
    logger.error({
      msg: error.message,
      code: error.code,
      statusCode: error.statusCode,
      meta: error.meta,
      context,
      stack: error.stack,
    });
    return error;
  }

  // Handle unknown errors
  const unknownError = error instanceof Error ? error : new Error(String(error));
  logger.error({
    msg: unknownError.message,
    context,
    stack: unknownError.stack,
  });
  
  return new AppError(
    process.env.NODE_ENV === 'development' 
      ? unknownError.message 
      : 'An unexpected error occurred',
    500
  );
};

// Async error wrapper
export const asyncHandler = <T>(
  fn: (...args: any[]) => Promise<T>
): ((...args: any[]) => Promise<T>) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, fn.name);
    }
  };
}; 