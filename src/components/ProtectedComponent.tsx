
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { ResourceType, ActionType } from '../types/rbac';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface ProtectedComponentProps {
  resource: ResourceType | string;
  action?: ActionType | string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL specified permissions
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  resource,
  action = 'view',
  children,
  fallback,
  requireAll = false
}) => {
  const { hasPermission } = usePermissions();

  const hasAccess = Array.isArray(resource) && Array.isArray(action)
    ? requireAll
      ? resource.every((res, idx) => hasPermission(res, action[idx] || 'view'))
      : resource.some((res, idx) => hasPermission(res, action[idx] || 'view'))
    : hasPermission(resource as string, action as string);

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Alert className="border-red-200 bg-red-50">
        <ShieldX className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You don't have permission to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

// Higher-order component version
export const withPermission = (
  resource: ResourceType | string,
  action: ActionType | string = 'view'
) => {
  return <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => (
      <ProtectedComponent resource={resource} action={action}>
        <Component {...props} />
      </ProtectedComponent>
    );
  };
};
