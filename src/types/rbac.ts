
export type Role = 
  | 'super_admin'
  | 'admin' 
  | 'manager'
  | 'supervisor'
  | 'agent'
  | 'viewer'
  | 'partner_admin';

export type Permission = 
  | 'view_dashboard'
  | 'manage_partners'
  | 'configure_projects'
  | 'onboard_agents'
  | 'manage_citizens'
  | 'track_services'
  | 'view_reports'
  | 'assign_tasks'
  | 'view_team_performance'
  | 'setup_chatbot'
  | 'access_encryption'
  | 'view_agents'
  | 'edit_agents'
  | 'assign_routes'
  | 'view_analytics'
  | 'manage_pricing'
  | 'manage_bank_details'
  | 'approve_commissions'
  | 'manage_reimbursements'
  | 'manage_hrms'
  | 'manage_settings';

export interface RoleConfig {
  name: string;
  description: string;
  permissions: Permission[];
  inheritFrom?: Role[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  projectId?: string;
  partnerId?: string;
}
