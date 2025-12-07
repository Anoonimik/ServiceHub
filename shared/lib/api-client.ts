import { ApiError } from './api/response';

interface ApiRequestOptions extends RequestInit {
  body?: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, headers = {}, ...fetchOptions } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers: requestHeaders,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.error || `HTTP error! status: ${response.status}`;
      throw new ApiError(response.status, errorMessage, data.details);
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(500, 'Unknown error occurred');
  }
}
