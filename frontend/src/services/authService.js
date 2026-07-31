import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) =>
    api.put('/auth/update-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (payload) => api.put('/auth/change-password', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (token, payload) => api.put(`/auth/reset-password/${token}`, payload),
};

export default authService;
