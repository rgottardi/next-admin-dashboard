import { NextResponse } from 'next/server';
import { AppError, handleError } from './error';

export const handleApiError = (error: unknown) => {
  const handledError = handleError(error, 'API');

  return NextResponse.json(
    {
      error: {
        message: handledError.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: handledError instanceof Error ? handledError.stack : undefined,
        }),
      },
    },
    { status: handledError instanceof AppError ? handledError.statusCode : 500 }
  );
};

export const createApiHandler = (handler: Function) => {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}; 