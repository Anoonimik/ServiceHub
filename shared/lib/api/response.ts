import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function successResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    { success: true, data },
    { status: statusCode }
  );
}

export function errorResponse(error: unknown, defaultMessage: string = 'Internal server error') {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || defaultMessage,
      },
      { status: 500 }
    );
  }

  console.error('Unknown error:', error);
  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
    },
    { status: 500 }
  );
}

export function handleApiRoute<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  return handler()
    .then((data) => successResponse(data))
    .catch((error) => errorResponse(error));
}

