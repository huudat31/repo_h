const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  let response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache || 'no-store',
  });

  // Tự động refresh token nếu gặp 401 Unauthorized
  if (response.status === 401 && typeof window !== 'undefined') {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const tokenData = await refreshRes.json();
          localStorage.setItem('token', tokenData.accessToken);
          localStorage.setItem('refreshToken', tokenData.refreshToken);

          // Retry request với token mới
          headers['Authorization'] = `Bearer ${tokenData.accessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
            cache: options.cache || 'no-store',
          });
        } else {
          // Token không còn hợp lệ, xóa dữ liệu đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth_changed'));
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth_changed'));
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message || `API Error: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
