import axiosInstance from '../api/axios.config';
import { AuthResponse } from '../lib/types/models/admin.type';

const AuthService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/api/login', credentials);
    return response.data;
  },

  register: async (data: any): Promise<AdminProfile> => {
    const response = await axiosInstance.post<AdminProfile>('/api/register', data);
    return response.data;
  },

  refreshToken: async (token: string): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<{ accessToken: string }>('/api/refresh', { refreshToken: token });
    return response.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.get<AuthResponse>('/api/admins/me');
    return response.data;
  },

  updateMe: async (data: any): Promise<{ user: AuthResponse; message: string }> => {
    const response = await axiosInstance.patch('/api/admins/me', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const response = await axiosInstance.post('/api/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: any): Promise<string> => {
    const response = await axiosInstance.post('/api/reset-password', data);
    return response.data;
  }
};

export default AuthService;