  // client/src/context/AuthContext.tsx
  import { createContext, useContext, useState, useEffect} from 'react';
  import type { ReactNode } from 'react';
  import api from '@/lib/api';

  interface User {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  }

  interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ensure axios has the Authorization header if a token exists on first load
    useEffect(() => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }, []);

    const setToken = (newToken: string | null) => {
      setTokenState(newToken);
      if (newToken) {
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      }
    };

    const logout = () => {
      setToken(null);
    };

    const isAuthenticated = !!token;

    // Fetch user profile when token changes
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (token) {
          try {
            setIsLoading(true);
            const response = await api.get('/profile');
            setUser(response.data.user);
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // If profile fetch fails, token might be invalid
            setToken(null);
          } finally {
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }, [token]);

    return (
      <AuthContext.Provider value={{ token, user, setToken, logout, isAuthenticated, isLoading }}>
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