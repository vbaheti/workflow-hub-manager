
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Shield } from 'lucide-react';
import { useRBAC } from '../contexts/RBACContext';
import { Role } from '../types/rbac';
import { ROLES_CONFIG } from '../config/roles';

const RoleSelector = () => {
  const { currentUser, setCurrentUser } = useRBAC();

  const handleRoleChange = (newRole: Role) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: newRole
      });
    }
  };

  if (!currentUser) return null;

  const roleConfig = ROLES_CONFIG[currentUser.role];

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Shield className="w-4 h-4" />
        Current Role (Demo)
      </label>
      <div className="flex items-center gap-2">
        <Select value={currentUser.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLES_CONFIG).map(([role, config]) => (
              <SelectItem key={role} value={role}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {config.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline">
          {roleConfig.name}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {roleConfig.description}
      </p>
    </div>
  );
};

export default RoleSelector;
