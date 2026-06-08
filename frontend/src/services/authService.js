import { api } from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('ss_token')
    localStorage.removeItem('ss_user')
  },
}
