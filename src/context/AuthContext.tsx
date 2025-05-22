import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('medrem_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Mock login function - would connect to a real API in production
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just check email format and have two mock users
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      let mockUser: User;
      
      if (email === 'doctor@example.com') {
        mockUser = {
          id: 'd1',
          name: 'Dr. Sarah Johnson',
          email: 'doctor@example.com',
          role: 'doctor',
          profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        };
      } else if (email === 'patient@example.com') {
        mockUser = {
          id: 'p1',
          name: 'Alex Morgan',
          email: 'patient@example.com',
          role: 'patient',
          profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('medrem_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!userData.email || !password || !userData.name || !userData.role) {
        throw new Error('All fields are required');
      }
      
      // Create a mock user - in a real app, this would be created on the server
      const newUser: User = {
        id: `u${Math.floor(Math.random() * 1000)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profileImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('medrem_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('medrem_user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};