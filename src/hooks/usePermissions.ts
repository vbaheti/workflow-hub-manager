
import { useAuth } from '../contexts/AuthContext';
import { ROLES, ROLE_HIERARCHY } from '../config/roles';
import { Permission, Role, ResourceType, ActionType } from '../types/rbac';

export const usePermissions = () => {
  const { user } = useAuth();

  const getAllUserRoles = (): Role[] => {
    if (!user) return [];
    
    const allRoles = new Set<string>();
    
    // Add user's direct roles
    user.roles.forEach(roleId => allRoles.add(roleId));
    
    // Add inherited roles
    user.roles.forEach(roleId => {
      const inherited = getInheritedRoles(roleId);
      inherited.forEach(inheritedRole => allRoles.add(inheritedRole));
    });
    
    return Array.from(allRoles)
      .map(roleId => ROLES[roleId])
      .filter(Boolean);
  };

  const getInheritedRoles = (roleId: string): string[] => {
    const inherited: string[] = [];
    const toProcess = [roleId];
    const processed = new Set<string>();
    
    while (toProcess.length > 0) {
      const currentRole = toProcess.shift()!;
      if (processed.has(currentRole)) continue;
      
      processed.add(currentRole);
      const children = ROLE_HIERARCHY[currentRole] || [];
      children.forEach(child => {
        inherited.push(child);
        toProcess.push(child);
      });
    }
    
    return inherited;
  };

  const getAllPermissions = (): Permission[] => {
    const roles = getAllUserRoles();
    const permissions: Permission[] = [];
    
    roles.forEach(role => {
      permissions.push(...role.permissions);
    });
    
    return permissions;
  };

  const hasPermission = (resource: ResourceType | string, action: ActionType | string): boolean => {
    if (!user) return false;
    
    const permissions = getAllPermissions();
    
    return permissions.some(permission => {
      // Check for wildcard permissions
      if (permission.resource === '*' && permission.action === '*') return true;
      if (permission.resource === '*' && permission.action === action) return true;
      if (permission.resource === resource && permission.action === '*') return true;
      
      // Check for exact match
      return permission.resource === resource && permission.action === action;
    });
  };

  const canAccess = (resource: ResourceType | string): boolean => {
    return hasPermission(resource, 'view');
  };

  const canEdit = (resource: ResourceType | string): boolean => {
    return hasPermission(resource, 'edit');
  };

  const canDelete = (resource: ResourceType | string): boolean => {
    return hasPermission(resource, 'delete');
  };

  const canCreate = (resource: ResourceType | string): boolean => {
    return hasPermission(resource, 'create');
  };

  const canApprove = (resource: ResourceType | string): boolean => {
    return hasPermission(resource, 'approve');
  };

  const canManage = (resource: ResourceType | string): boolean => {
    return hasPermission(resource, 'manage');
  };

  const getHighestRole = (): Role | null => {
    const roles = getAllUserRoles();
    return roles.reduce((highest, current) => {
      return !highest || current.level > highest.level ? current : highest;
    }, null as Role | null);
  };

  return {
    user,
    getAllUserRoles,
    hasPermission,
    canAccess,
    canEdit,
    canDelete,
    canCreate,
    canApprove,
    canManage,
    getHighestRole
  };
};
