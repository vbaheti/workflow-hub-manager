
import { Role, Permission, RoleConfig } from '../types/rbac';

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  super_admin: ['admin', 'manager', 'supervisor', 'agent', 'viewer', 'partner_admin'],
  admin: ['manager', 'partner_admin'],
  manager: ['supervisor'],
  supervisor: ['agent'],
  agent: [],
  viewer: [],
  partner_admin: []
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'view_dashboard', 'manage_partners', 'configure_projects', 'onboard_agents',
    'manage_citizens', 'track_services', 'view_reports', 'assign_tasks',
    'view_team_performance', 'setup_chatbot', 'access_encryption', 'view_agents',
    'edit_agents', 'assign_routes', 'view_analytics', 'manage_pricing',
    'manage_bank_details', 'approve_commissions', 'manage_reimbursements',
    'manage_hrms', 'manage_settings'
  ],
  admin: [
    'view_dashboard', 'manage_partners', 'configure_projects', 'onboard_agents',
    'manage_citizens', 'track_services', 'view_reports', 'assign_tasks',
    'view_team_performance', 'setup_chatbot', 'access_encryption', 'view_agents',
    'edit_agents', 'assign_routes', 'view_analytics', 'manage_pricing',
    'manage_bank_details', 'approve_commissions', 'manage_reimbursements',
    'manage_hrms', 'manage_settings'
  ],
  manager: [
    'view_dashboard', 'onboard_agents', 'manage_citizens', 'track_services',
    'view_reports', 'assign_tasks', 'view_team_performance', 'view_agents',
    'edit_agents', 'assign_routes', 'view_analytics', 'approve_commissions',
    'manage_reimbursements'
  ],
  supervisor: [
    'onboard_agents', 'manage_citizens', 'track_services', 'view_reports',
    'assign_tasks', 'view_team_performance', 'view_agents', 'edit_agents',
    'assign_routes', 'view_analytics'
  ],
  agent: [
    'onboard_agents', 'manage_citizens', 'track_services', 'view_agents'
  ],
  viewer: [
    'view_dashboard', 'view_reports', 'view_agents', 'view_analytics'
  ],
  partner_admin: [
    'onboard_agents', 'manage_citizens', 'track_services', 'view_reports',
    'view_agents', 'view_analytics'
  ]
};

export const ROLES_CONFIG: Record<Role, RoleConfig> = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full access across all projects, partners, agents, and system settings',
    permissions: ROLE_PERMISSIONS.super_admin
  },
  admin: {
    name: 'Admin',
    description: 'Manages partner/project configurations, user roles, and reports',
    permissions: ROLE_PERMISSIONS.admin
  },
  manager: {
    name: 'Manager',
    description: 'Manages team performance, assigns tasks, tracks services and operations',
    permissions: ROLE_PERMISSIONS.manager
  },
  supervisor: {
    name: 'Supervisor',
    description: 'Monitors agents, reviews tasks, schedules visits, and ensures compliance',
    permissions: ROLE_PERMISSIONS.supervisor
  },
  agent: {
    name: 'Agent',
    description: 'Field operator handling citizen onboarding, service tracking, data upload',
    permissions: ROLE_PERMISSIONS.agent
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access to reports and dashboards',
    permissions: ROLE_PERMISSIONS.viewer
  },
  partner_admin: {
    name: 'Partner Admin',
    description: 'Can onboard agents and view/manage project-specific data (limited scope)',
    permissions: ROLE_PERMISSIONS.partner_admin
  }
};
