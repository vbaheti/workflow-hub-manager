
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/rbac';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo - replace with real authentication
const mockUser: User = {
  id: 'user-1',
  name: 'John Admin',
  email: 'admin@company.com',
  roles: ['admin'] // Can have multiple roles
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
