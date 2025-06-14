
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, Permission, User } from '../types/rbac';
import { ROLE_HIERARCHY, ROLE_PERMISSIONS } from '../config/roles';

interface RBACContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  canAccess: (requiredPermissions: Permission[]) => boolean;
  isAtLeastRole: (role: Role) => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: ReactNode;
  initialUser?: User;
}

export const RBACProvider = ({ children, initialUser }: RBACProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    initialUser || {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'manager', // Default role for demo
      projectId: 'project-alpha'
    }
  );

  const getAllUserPermissions = (userRole: Role): Permission[] => {
    const directPermissions = ROLE_PERMISSIONS[userRole] || [];
    const inheritedRoles = ROLE_HIERARCHY[userRole] || [];
    
    const inheritedPermissions = inheritedRoles.flatMap(role => 
      ROLE_PERMISSIONS[role] || []
    );
    
    return [...new Set([...directPermissions, ...inheritedPermissions])];
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    const userPermissions = getAllUserPermissions(currentUser.role);
    return userPermissions.includes(permission);
  };

  const hasRole = (role: Role): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  const canAccess = (requiredPermissions: Permission[]): boolean => {
    if (!currentUser) return false;
    return requiredPermissions.every(permission => hasPermission(permission));
  };

  const isAtLeastRole = (role: Role): boolean => {
    if (!currentUser) return false;
    const userRole = currentUser.role;
    
    // Check if user has the exact role or inherits from it
    if (userRole === role) return true;
    
    const inheritedRoles = ROLE_HIERARCHY[userRole] || [];
    return inheritedRoles.includes(role);
  };

  const value = {
    currentUser,
    setCurrentUser,
    hasPermission,
    hasRole,
    canAccess,
    isAtLeastRole
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
