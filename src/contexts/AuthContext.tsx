import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

export type UserRole = 'user' | 'admin' | 'business';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Initializing authentication...');
      console.log('🌐 Backend API:', authService.getApiUrl());
      setIsLoading(true);

      try {
        // Check backend health first
        const isHealthy = await authService.healthCheck();
        if (!isHealthy) {
          console.warn('⚠️ Backend health check failed - backend may not be deployed');
          console.warn('🔍 Please ensure backend is deployed at:', authService.getApiUrl());
        }

        const token = authService.getToken();
        
        if (token) {
          console.log('🔑 Token found, verifying with backend...');
          const isValid = await authService.verifyToken();
          
          if (isValid) {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
              console.log('✅ User authenticated:', currentUser.email);
              setUser(currentUser);
            } else {
              console.log('⚠️ Token valid but no user data found');
              authService.logout();
            }
          } else {
            console.log('❌ Token verification failed with backend');
            authService.logout();
          }
        } else {
          console.log('ℹ️ No authentication token found');
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        console.error('🔌 This may indicate backend is not deployed or accessible');
        authService.logout();
      } finally {
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Logging in user:', email);
      console.log('🎯 Backend endpoint:', authService.getApiUrl());
      setIsLoading(true);

      const response = await authService.login({ email, password });

      if (response.success && response.data.user) {
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role as UserRole
        };

        setUser(userData);
        console.log('✅ Login successful, user set:', userData);
      } else {
        throw new Error('Login failed: Invalid response from backend');
      }
    } catch (error) {
      console.error('❌ Login error in context:', error);
      if (error instanceof Error && error.message.includes('Backend server is not responding')) {
        console.error('🚨 CRITICAL: Backend is not deployed or accessible');
        console.error('📋 Action required: Deploy backend first at:', authService.getApiUrl());
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      console.log('📝 Registering user:', email);
      console.log('🎯 Backend endpoint:', authService.getApiUrl());
      setIsLoading(true);

      const response = await authService.register({
        email,
        password,
        name,
        role
      });

      if (response.success && response.data.user) {
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role as UserRole
        };

        setUser(userData);
        console.log('✅ Registration successful, user set:', userData);
      } else {
        throw new Error('Registration failed: Invalid response from backend');
      }
    } catch (error) {
      console.error('❌ Registration error in context:', error);
      if (error instanceof Error && error.message.includes('Backend server is not responding')) {
        console.error('🚨 CRITICAL: Backend is not deployed or accessible');
        console.error('📋 Action required: Deploy backend first at:', authService.getApiUrl());
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out user');
    authService.logout();
    setUser(null);
    navigate('/login', { replace: true });
    console.log('✅ Logout complete, redirected to login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ User data updated:', updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;