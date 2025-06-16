// src/store/authStore.ts
import {create} from 'zustand';
import { persist } from 'zustand/middleware'; // For persisting state to localStorage

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'SUPPORT' | 'ADMIN';
  // Add other user properties as needed
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void; // In case user details need update
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, userData) => {
        set({ token, user: userData, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        // Optionally clear other persisted data if any
      },
      setUser: (userData) => {
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage', // Name of the item in localStorage
      // getStorage: () => localStorage, // Default is localStorage
      // partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }), // Persist only specific parts
    }
  )
);
