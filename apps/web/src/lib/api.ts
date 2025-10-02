const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiRequest(method: string, path: string, data?: any) {
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

  const response = await fetch(`${API_URL}${path}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, data?: any) => apiRequest('POST', path, data),
  put: (path: string, data?: any) => apiRequest('PUT', path, data),
  delete: (path: string) => apiRequest('DELETE', path),
};
