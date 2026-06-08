import { api } from './api';

export const volunteerService = {
  dashboard: () => api.get('/volunteer/dashboard'),
  toggleAvailability: () => api.patch('/volunteer/availability/toggle'),
  acceptAssignment: (assignmentId) => api.post(`/volunteer/assignments/${assignmentId}/accept`, {}),
  markPickedUp: (assignmentId) => api.post(`/volunteer/assignments/${assignmentId}/picked-up`, {}),
  markDelivered: (assignmentId) => api.post(`/volunteer/assignments/${assignmentId}/delivered`, {}),
};