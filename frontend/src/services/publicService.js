import api from './api';

export const publicService = {
  getPlans: (params) => api.get('/plans', { params }),
  getTrainers: (params) => api.get('/trainers', { params }),
  getGallery: (params) => api.get('/gallery', { params }),
  submitContact: (payload) => api.post('/contact', payload),
};

export default publicService;
