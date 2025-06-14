
import React from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { Permission } from '../types/rbac';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface PermissionGateProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  children,
  fallback,
  requireAll = true
}) => {
  const { canAccess, hasPermission } = useRBAC();

  const hasAccess = requireAll 
    ? canAccess(permissions)
    : permissions.some(permission => hasPermission(permission));

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="border-amber-200 bg-amber-50">
        <Lock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>You don't have permission to access this feature.</span>
          </div>
          <p className="text-xs mt-1 text-amber-700">
            Required permissions: {permissions.join(', ')}
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionGate;
