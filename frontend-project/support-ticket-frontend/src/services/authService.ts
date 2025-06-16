// src/services/authService.ts
import apiClient from './api';
import { useAuthStore } from '../store/authStore';

// Define interfaces for request payloads and responses
interface LoginPayload {
  email?: string; // Made optional to satisfy linter for register payload
  password?: string; // Made optional to satisfy linter for register payload
  name?: string; // For registration
  role?: string; // For registration (optional)
  phoneNumber?: string; // For registration (optional)
}

interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  role: 'CLIENT' | 'SUPPORT' | 'ADMIN';
  // Add other fields returned by your backend on login/register
}

export const loginUser = async (credentials: LoginPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  if (response.data.token && response.data.userId) {
    const { token, ...userData } = response.data;
    useAuthStore.getState().login(token, {id: userData.userId, name: userData.name, email: credentials.email!, role: userData.role });
  }
  return response.data;
};

export const registerUser = async (userData: LoginPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData);
   if (response.data.token && response.data.userId) {
    const { token, ...returnedUserData } = response.data;
    // Assuming email is part of userData for registration
    useAuthStore.getState().login(token, {id: returnedUserData.userId, name: returnedUserData.name, email: userData.email!, role: returnedUserData.role });
  }
  return response.data;
};

export const logoutUser = () => {
  useAuthStore.getState().logout();
  // Optionally call a backend /auth/logout endpoint if it exists
};

// Placeholder for password recovery
export const requestPasswordReset = async (email: string) => {
  return apiClient.post('/auth/request-password-reset', { email });
};

export const resetPassword = async (token: string, newPassword B: string) => {
  return apiClient.post('/auth/reset-password', { token, newPassword });
};
