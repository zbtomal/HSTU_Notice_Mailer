const BASE_URL = '/api/v1';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

/**
 * Custom API Client helper for HSTU Notice Mailer backend
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token = null, isRetry = false } = {}) {
  const authToken = token || localStorage.getItem('access_token');
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Automatic Silent Refresh on 401 Unauthorized
    if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (storedRefreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshRes = await authApi.refreshToken(storedRefreshToken);
          isRefreshing = false;
          if (refreshRes.ok && refreshRes.data?.access_token) {
            const newAccessToken = refreshRes.data.access_token;
            localStorage.setItem('access_token', newAccessToken);
            if (refreshRes.data.refresh_token) {
              localStorage.setItem('refresh_token', refreshRes.data.refresh_token);
            }
            onRefreshed(newAccessToken);
            return apiRequest(endpoint, { method, body, headers, token: newAccessToken, isRetry: true });
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } else {
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              resolve(apiRequest(endpoint, { method, body, headers, token: newToken, isRetry: true }));
            });
          });
        }
      }
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { ok: true, data: null };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.detail 
        ? (Array.isArray(data.detail) ? data.detail.map(e => e.msg).join(', ') : data.detail)
        : `Request failed with status ${response.status}`;
      return { ok: false, error: errorMsg, status: response.status, data };
    }

    return { ok: true, data, status: response.status };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error occurred. Please check your connection.' };
  }
}

// Authentication API methods
export const authApi = {
  register: (email, password) => 
    apiRequest('/auth/register', { method: 'POST', body: { email, password } }),
  
  verifyEmail: (email, otp) => 
    apiRequest('/auth/verify-email', { method: 'POST', body: { email, otp } }),

  resendOtp: (email) => 
    apiRequest('/auth/resend-otp', { method: 'POST', body: { email } }),

  login: (email, password) => 
    apiRequest('/auth/login', { method: 'POST', body: { email, password } }),

  refreshToken: (refresh_token) =>
    apiRequest('/auth/refresh', { method: 'POST', body: { refresh_token } }),

  getMe: (token) => 
    apiRequest('/auth/me', { method: 'GET', token }),

  forgotPassword: (email) => 
    apiRequest('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: (email, otp, new_password) => 
    apiRequest('/auth/reset-password', { method: 'POST', body: { email, otp, new_password } }),

  changePassword: (old_password, new_password) => 
    apiRequest('/auth/change-password', { method: 'POST', body: { old_password, new_password } }),
};

// Notice API methods
export const noticeApi = {
  getNotices: ({ page = 1, limit = 12, category_id = null, search = null }) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (category_id) params.append('category_id', category_id);
    if (search && search.trim()) params.append('search', search.trim());

    return apiRequest(`/notices?${params.toString()}`);
  },
};

// User Subscriptions & Category API methods
export const userApi = {
  getCategories: () => 
    apiRequest('/users/categories'),

  subscribe: (category_name) => {
    const params = new URLSearchParams({ category_name });
    return apiRequest(`/users/subscribe?${params.toString()}`, { method: 'POST' });
  },

  unsubscribe: (category_name) => {
    const params = new URLSearchParams({ category_name });
    return apiRequest(`/users/unsubscribe?${params.toString()}`, { method: 'POST' });
  },

  subscribeAll: () => 
    apiRequest('/users/subscribe-all', { method: 'POST' }),

  unsubscribeAll: () => 
    apiRequest('/users/unsubscribe-all', { method: 'POST' }),

  updateProfile: (full_name, is_email_paused) => {
    const body = {};
    if (full_name !== undefined) body.full_name = full_name;
    if (is_email_paused !== undefined) body.is_email_paused = is_email_paused;
    return apiRequest('/users/me', { method: 'PATCH', body });
  },
};
