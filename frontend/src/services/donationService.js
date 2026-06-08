import { api } from './api';

export const donationService = {
  create:           (data) => api.post('/donations', data),
  myDonations:      ()     => api.get('/donations/my'),
  myStats:          ()     => api.get('/donations/my/stats'),
  getById:          (id)   => api.get(`/donations/${id}`),
  cancel:           (id)   => api.patch(`/donations/${id}/cancel`),
  getFoodCategories:()     => api.get('/donations/categories'),
};
