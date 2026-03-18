import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthState, AuthContextType } from '@/lib/types';
import { useAuthFetch } from "@/hooks/use-auth-fetch";


// const USERS_API_URL = 'https://techculture.portaldeanuncios.com/api/v2/users/';
const USERS_API_URL = 'https://techculture.portaldeanuncios.com/distrimov/api/users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const { authFetch } = useAuthFetch();

  const login = useCallback(async (login: string, password: string): Promise<boolean> => {
    try {
      // Busca usuários da API      
      const users: User[] = await authFetch({url: `/users?email=${login}`});
      const user = users.find(u => (u.email == login) && (u.password === btoa(password)) );
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwic3lzIjoiY2F0YWxvZyIsIm93bmVyIjoidGVjaGN1bHR1cmUiLCJpYXQiOjE3Njk1MjQ5NzksImV4cCI6MTc2OTUyODU3OX0=.jZP+Ek0Ojx5JuF7EOTO2C48Y0BgX76JV2STJ5aku2ec=';
      console.log(users);
      if (user && password.length >= 6) {
        setAuthState({ user, isAuthenticated: true });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string, role: string = 'user'): Promise<boolean> => {
    if (!name || !email || password.length < 6) {
      return false;
    }

    try {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        phone,
        email,
        password: btoa(password),
        role
      };

      const createdUser: User = await authFetch({
        url: 'users/',
        method: 'POST',
        body: newUser
      });

      setAuthState({ user: createdUser.reg || newUser, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
