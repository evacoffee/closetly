import { useState } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export function useApi<T = any, B = any>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const callApi = async (
    method: HttpMethod = 'GET',
    body?: B,
    options: UseApiOptions<T> = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
      options.onSuccess?.(responseData);
      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
      options.onFinally?.();
    }
  };

  return {
    data,
    error,
    loading,
    get: () => callApi('GET'),
    post: (body?: B) => callApi('POST', body),
    put: (body?: B) => callApi('PUT', body),
    delete: () => callApi('DELETE'),
    patch: (body?: B) => callApi('PATCH', body),
  };
}