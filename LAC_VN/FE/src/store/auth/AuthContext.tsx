import { createContext } from 'react';
import { AuthState, LoginRequest, RegisterRequest } from '../../types/auth.types';

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
