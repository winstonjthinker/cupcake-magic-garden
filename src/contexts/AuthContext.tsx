import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { getToken, clearToken as clearStoredToken } from '@/lib/auth';

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_vendor: boolean;
  is_superuser?: boolean;
  profile_picture?: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

type RegisterResponse = {
  access?: string;
  refresh?: string;
  user?: User;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;
  const isAdmin = user?.is_superuser || false;

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authApi.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          clearStoredToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
     const { data } = await authApi.login<LoginResponse>(email, password);
const { access, refresh } = data;
      
      if (!access) {
        throw new Error('No access token received');
      }
      
      // Store tokens
      localStorage.setItem('access_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
      
      // Fetch the user profile to get complete user data (backend returns user object directly)
      const profileResponse = await authApi.getProfile<User>();
      setUser(profileResponse.data as unknown as User);
    } catch (error: any) {
      console.error('Login error:', error);
      // Clear any partial auth state on error
      if (error.response?.status === 401) {
        clearStoredToken();
      }
      throw error; // Re-throw to be handled by the component
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }): Promise<void> => {
    try {
      // First, register the user
      await authApi.register<{ message: string }>(data);
      
      // After successful registration, log in the user
      const response = await authApi.login<{ access: string; refresh?: string }>(
        data.email,
        data.password
      );
      const { access, refresh } = response.data;
      
      if (!access) {
        throw new Error('Login after registration failed: No access token received');
      }
      
      // Store tokens
      localStorage.setItem('access_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
      
      // Fetch and set the user profile
      const profileResponse = await authApi.getProfile<User>();
      setUser(profileResponse.data as unknown as User);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        // Handle different types of error responses
        if (typeof error.response.data === 'object') {
          const errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
            .join('\n');
          throw new Error(errorMessage);
        }
        
        if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        }
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  const updateUser = (newData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...newData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.is_superuser || false,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
