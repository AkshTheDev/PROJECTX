  // client/src/context/AuthContext.tsx
  import { createContext, useContext, useState} from 'react';
  import type { ReactNode } from 'react';
  import api from '@/lib/api';

  interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));

    const setToken = (newToken: string | null) => {
      setTokenState(newToken);
      if (newToken) {
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    };

    const logout = () => {
      setToken(null);
    };

    const isAuthenticated = !!token;

    return (
      <AuthContext.Provider value={{ token, setToken, logout, isAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }