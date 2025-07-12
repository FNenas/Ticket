// src/services/userService.ts
import apiClient from './api';
import { User } from '../types/userTypes'; // Adjust path if your User type is elsewhere

// Get all users (primarily for admin to list, e.g., support agents)
// Backend should have an endpoint like GET /api/users (protected for ADMIN)
// And ideally allow filtering by role, e.g., /api/users?role=SUPPORT
export const getAllUsers = async (role?: 'CLIENT' | 'SUPPORT' | 'ADMIN'): Promise<User[]> => {
  let url = '/users';
  if (role) {
    url += `?role=${role}`;
  }
  const response = await apiClient.get<User[]>(url);
  return response.data;
};

// Get a specific user by ID (if needed)
export const getUserById = async (userId: number | string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
};
