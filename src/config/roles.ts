
import { Role, RESOURCES, ACTIONS } from '../types/rbac';

export const ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full system access',
    level: 100,
    permissions: [
      { resource: '*', action: '*' } // Wildcard for all permissions
    ]
  },
  
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full administrative access to agents and services',
    level: 90,
    permissions: [
      { resource: RESOURCES.AGENTS, action: '*' },
      { resource: RESOURCES.AGENT_MANAGEMENT, action: '*' },
      { resource: RESOURCES.AGENT_ASSIGNMENT, action: '*' },
      { resource: RESOURCES.AGENT_TRACKING, action: '*' },
      { resource: RESOURCES.AGENT_ANALYTICS, action: '*' },
      { resource: RESOURCES.SERVICE_PRICING, action: '*' },
      { resource: RESOURCES.BANK_DETAILS, action: '*' },
      { resource: RESOURCES.FINANCIAL_DATA, action: '*' },
      { resource: RESOURCES.SENSITIVE_DATA, action: ACTIONS.VIEW }
    ]
  },
  
  SUPERVISOR: {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Can manage agents and approve transactions',
    level: 70,
    permissions: [
      { resource: RESOURCES.AGENTS, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_MANAGEMENT, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_MANAGEMENT, action: ACTIONS.EDIT },
      { resource: RESOURCES.AGENT_ASSIGNMENT, action: '*' },
      { resource: RESOURCES.AGENT_TRACKING, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_ANALYTICS, action: ACTIONS.VIEW },
      { resource: RESOURCES.SERVICE_PRICING, action: ACTIONS.VIEW },
      { resource: RESOURCES.BANK_DETAILS, action: ACTIONS.VIEW },
      { resource: RESOURCES.FINANCIAL_DATA, action: ACTIONS.APPROVE }
    ]
  },
  
  MANAGER: {
    id: 'manager',
    name: 'Manager',
    description: 'Can view and assign agents',
    level: 50,
    permissions: [
      { resource: RESOURCES.AGENTS, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_MANAGEMENT, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_ASSIGNMENT, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_ASSIGNMENT, action: ACTIONS.ASSIGN },
      { resource: RESOURCES.AGENT_TRACKING, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_ANALYTICS, action: ACTIONS.VIEW },
      { resource: RESOURCES.SERVICE_PRICING, action: ACTIONS.VIEW }
    ]
  },
  
  AGENT_COORDINATOR: {
    id: 'agent_coordinator',
    name: 'Agent Coordinator',
    description: 'Can coordinate agent activities and view tracking',
    level: 30,
    permissions: [
      { resource: RESOURCES.AGENTS, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_MANAGEMENT, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_ASSIGNMENT, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_TRACKING, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_ANALYTICS, action: ACTIONS.VIEW }
    ]
  },
  
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to basic agent information',
    level: 10,
    permissions: [
      { resource: RESOURCES.AGENTS, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_MANAGEMENT, action: ACTIONS.VIEW },
      { resource: RESOURCES.AGENT_TRACKING, action: ACTIONS.VIEW }
    ]
  }
};

// Role hierarchy for inheritance
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN.id]: [],
  [ROLES.ADMIN.id]: [ROLES.SUPERVISOR.id],
  [ROLES.SUPERVISOR.id]: [ROLES.MANAGER.id],
  [ROLES.MANAGER.id]: [ROLES.AGENT_COORDINATOR.id],
  [ROLES.AGENT_COORDINATOR.id]: [ROLES.VIEWER.id],
  [ROLES.VIEWER.id]: []
};
