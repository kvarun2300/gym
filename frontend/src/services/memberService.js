import api from './api';

export const memberService = {
  // Dashboard
  getMemberDashboard: () => api.get('/dashboard/member'),

  // Profile
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) =>
    api.put('/auth/update-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (payload) => api.put('/auth/change-password', payload),

  // Attendance
  checkIn: () => api.post('/attendance/check-in', { method: 'manual' }),
  checkOut: () => api.post('/attendance/check-out'),
  getMyAttendance: (params) => api.get('/attendance/my-history', { params }),

  // Payments & Invoices
  getMyPayments: (params) => api.get('/payments/my-history', { params }),
  getMyInvoices: (params) => api.get('/invoices/my-invoices', { params }),
  downloadInvoicePdfUrl: (id) => `/api/invoices/${id}/pdf`,

  // Workout / Diet plans
  getMyWorkoutPlans: () => api.get('/workout-plans/my-plans'),
  getMyDietPlans: () => api.get('/diet-plans/my-plans'),

  // Progress / BMI history
  getMyProgress: (params) => api.get('/progress/my-history', { params }),
  addProgress: (payload) => api.post('/progress', payload),

  // Notifications
  getMyNotifications: (params) => api.get('/notifications', { params }),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/notifications/read-all'),
};

export default memberService;
