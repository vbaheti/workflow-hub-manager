
export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number; // Higher number = higher authority
  permissions: Permission[];
  inheritsFrom?: string[]; // Role inheritance
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

// Resource constants
export const RESOURCES = {
  AGENTS: 'agents',
  AGENT_MANAGEMENT: 'agent_management',
  AGENT_ASSIGNMENT: 'agent_assignment',
  AGENT_TRACKING: 'agent_tracking',
  AGENT_ANALYTICS: 'agent_analytics',
  SERVICE_PRICING: 'service_pricing',
  BANK_DETAILS: 'bank_details',
  FINANCIAL_DATA: 'financial_data',
  SENSITIVE_DATA: 'sensitive_data'
} as const;

// Action constants
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  APPROVE: 'approve',
  ASSIGN: 'assign',
  EXPORT: 'export',
  MANAGE: 'manage'
} as const;

export type ResourceType = typeof RESOURCES[keyof typeof RESOURCES];
export type ActionType = typeof ACTIONS[keyof typeof ACTIONS];
