import api from './api';

export const trainerService = {
  // Dashboard
  getTrainerDashboard: () => api.get('/dashboard/trainer'),

  // Assigned members (server auto-scopes to this trainer)
  getMyMembers: (params) => api.get('/members', { params }),
  getMember: (id) => api.get(`/members/${id}`),

  // Attendance (server auto-scopes to assigned members)
  getAttendance: (params) => api.get('/attendance', { params }),
  markAttendance: (payload) => api.post('/attendance/manual', payload),
  checkIn: () => api.post('/attendance/check-in', { method: 'manual' }),
  checkOut: () => api.post('/attendance/check-out'),

  // Workout plans (server auto-scopes to this trainer)
  getWorkoutPlans: (params) => api.get('/workout-plans', { params }),
  createWorkoutPlan: (payload) => api.post('/workout-plans', payload),
  updateWorkoutPlan: (id, payload) => api.put(`/workout-plans/${id}`, payload),
  deleteWorkoutPlan: (id) => api.delete(`/workout-plans/${id}`),

  // Diet plans (server auto-scopes to this trainer)
  getDietPlans: (params) => api.get('/diet-plans', { params }),
  createDietPlan: (payload) => api.post('/diet-plans', payload),
  updateDietPlan: (id, payload) => api.put(`/diet-plans/${id}`, payload),
  deleteDietPlan: (id) => api.delete(`/diet-plans/${id}`),

  // Progress (view a member's history)
  getMemberProgress: (memberId, params) => api.get(`/progress/${memberId}`, { params }),

  // Profile
  updateProfile: (formData) =>
    api.put('/auth/update-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (payload) => api.put('/auth/change-password', payload),
};

export default trainerService;
