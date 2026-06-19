import { api } from './api';

export const adminService = {
  dashboard: () => api.get('/admin/dashboard'),
  approveNgo: (ngoId) => api.patch(`/admin/ngos/${ngoId}/approve`),
  rejectNgo: (ngoId) => api.patch(`/admin/ngos/${ngoId}/reject`),
};
