
import { Permission } from './rbac';

export type ApprovalType = 
  | 'agent_onboarding'
  | 'pricing_change'
  | 'commission_request'
  | 'bank_details_update'
  | 'route_assignment'
  | 'reimbursement_request';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  title: string;
  description: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  status: ApprovalStatus;
  approver?: string;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  metadata: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  requiredPermissions: Permission[];
  projectId?: string;
}

export interface ApprovalAction {
  id: string;
  requestId: string;
  action: 'approved' | 'rejected' | 'cancelled';
  performedBy: string;
  performedByName: string;
  timestamp: string;
  reason?: string;
  metadata?: Record<string, any>;
}
