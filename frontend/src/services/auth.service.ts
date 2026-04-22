import api from './api';

export const authService = {
  login: (employeeId: string, password: string) =>
    api.post('/auth/login', { employeeId, password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  register: (data: any) => api.post('/auth/register', data),

  registerAdmin: (data: any) => api.post('/auth/register-admin', data),

  checkRegistrationStatus: (registrationId: string) =>
    api.get(`/auth/register/status/${registrationId}`),
};
