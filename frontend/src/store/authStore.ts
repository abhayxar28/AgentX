import { create } from 'zustand';

export type AuthRole = 'agent' | 'admin';

export interface AuthUser {
  name: string;
  employeeId: string;
  branchId: string;
}

interface AuthState {
  token: string | null;
  role: AuthRole | null;
  user: AuthUser | null;
  setAuth: (token: string, role: AuthRole, user?: AuthUser | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role') as AuthRole | null,
  user: JSON.parse(localStorage.getItem('user') || 'null') as AuthUser | null,

  setAuth: (token, role, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ token, role, user: user ?? null });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    set({ token: null, role: null, user: null });
  },

  isAuthenticated: () => !!get().token,
}));
