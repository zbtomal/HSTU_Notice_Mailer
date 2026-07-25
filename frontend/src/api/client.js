const BASE_URL = '/api/v1';

/**
 * Custom API Client helper for HSTU Notice Mailer backend
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token = null } = {}) {
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

  updateProfile: (full_name) => 
    apiRequest('/users/me', { method: 'PATCH', body: { full_name } }),
};
