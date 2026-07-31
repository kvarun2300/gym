import api from './api';

export const adminService = {
  // Dashboard
  getAdminDashboard: () => api.get('/dashboard/admin'),

  // Members
  getMembers: (params) => api.get('/members', { params }),
  getMember: (id) => api.get(`/members/${id}`),
  createMember: (formData) => api.post('/members', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateMember: (id, formData) =>
    api.put(`/members/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteMember: (id) => api.delete(`/members/${id}`),

  // Trainers
  getTrainers: (params) => api.get('/trainers', { params }),
  getTrainer: (id) => api.get(`/trainers/${id}`),
  createTrainer: (formData) => api.post('/trainers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateTrainer: (id, formData) =>
    api.put(`/trainers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteTrainer: (id) => api.delete(`/trainers/${id}`),

  // Plans
  getPlans: (params) => api.get('/plans', { params }),
  createPlan: (payload) => api.post('/plans', payload),
  updatePlan: (id, payload) => api.put(`/plans/${id}`, payload),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export default adminService;
