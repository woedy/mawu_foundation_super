const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  public statusCode?: number;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryableStatuses?: number[];
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Exponential backoff delay
const getRetryDelay = (attempt: number, baseDelay: number): number => {
  return baseDelay * Math.pow(2, attempt);
};

export async function apiRequest(
  method: string,
  path: string,
  data?: any,
  retryOptions?: RetryOptions
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const retry = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= (retry.maxRetries || 0); attempt++) {
    try {
      const response = await fetch(`${API_URL}${path}`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Request failed',
        }));

        const apiError = new ApiError(
          errorData.error || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );

        // Check if we should retry
        if (
          attempt < (retry.maxRetries || 0) &&
          retry.retryableStatuses?.includes(response.status)
        ) {
          lastError = apiError;
          const delay = getRetryDelay(attempt, retry.retryDelay || 1000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network error or other fetch error
      const networkError = new ApiError(
        'Network error. Please check your connection and try again.',
        0,
        'NETWORK_ERROR'
      );

      if (attempt < (retry.maxRetries || 0)) {
        lastError = networkError;
        const delay = getRetryDelay(attempt, retry.retryDelay || 1000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw networkError;
    }
  }

  throw lastError || new ApiError('Request failed after retries');
}

export const api = {
  get: (path: string, retryOptions?: RetryOptions) =>
    apiRequest('GET', path, undefined, retryOptions),
  post: (path: string, data?: any, retryOptions?: RetryOptions) =>
    apiRequest('POST', path, data, retryOptions),
  put: (path: string, data?: any, retryOptions?: RetryOptions) =>
    apiRequest('PUT', path, data, retryOptions),
  delete: (path: string, retryOptions?: RetryOptions) =>
    apiRequest('DELETE', path, undefined, retryOptions),
};

// User-friendly error messages
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    // Map common error codes to user-friendly messages
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect. Please check your internet connection.';
      case 'VALIDATION_ERROR':
        return error.message || 'Please check your input and try again.';
      case 'PAYMENT_FAILED':
        return 'Payment failed. Please check your payment details and try again.';
      case 'INSUFFICIENT_INVENTORY':
        return 'Some items in your cart are no longer available.';
      case 'UNAUTHORIZED':
        return 'Please log in to continue.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
