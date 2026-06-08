import { api } from './api';

export const ngoService = {
  dashboard: () => api.get('/ngo/dashboard'),
  acceptDonation: (donationId) => api.post(`/ngo/donations/${donationId}/accept`, {}),
  rejectDonation: (donationId) => api.post(`/ngo/donations/${donationId}/reject`, {}),
};