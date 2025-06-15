
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ApprovalRequest, ApprovalAction, ApprovalType, ApprovalStatus } from '../types/approvals';
import { useRBAC } from './RBACContext';
import { useProject } from './ProjectContext';
import { useToast } from '@/hooks/use-toast';

interface ApprovalContextType {
  approvalRequests: ApprovalRequest[];
  approvalActions: ApprovalAction[];
  createApprovalRequest: (request: Omit<ApprovalRequest, 'id' | 'requestedAt' | 'status'>) => string;
  approveRequest: (requestId: string, reason?: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  cancelRequest: (requestId: string, reason?: string) => void;
  getPendingApprovals: () => ApprovalRequest[];
  getApprovalsByType: (type: ApprovalType) => ApprovalRequest[];
  getUserPendingApprovals: () => ApprovalRequest[];
}

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

// Mock data for initial state
const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'APR-001',
    type: 'agent_onboarding',
    title: 'New Agent Onboarding - Sarah Wilson',
    description: 'Request to onboard new agent Sarah Wilson for Project Alpha',
    requestedBy: 'U-002',
    requestedByName: 'John Supervisor',
    requestedAt: '2024-01-15T10:00:00Z',
    status: 'pending',
    metadata: {
      agentName: 'Sarah Wilson',
      agentEmail: 'sarah.wilson@example.com',
      projectId: 'project-alpha',
      role: 'agent'
    },
    priority: 'high',
    requiredPermissions: ['onboard_agents'],
    projectId: 'project-alpha'
  },
  {
    id: 'APR-002',
    type: 'pricing_change',
    title: 'Pricing Rule Update - Legal Consultation',
    description: 'Request to update pricing for Legal Consultation service',
    requestedBy: 'U-003',
    requestedByName: 'Mike Manager',
    requestedAt: '2024-01-14T14:30:00Z',
    status: 'pending',
    metadata: {
      serviceName: 'Legal Consultation',
      oldPrice: 5000,
      newPrice: 5500,
      ruleSetId: 'RS-001'
    },
    priority: 'medium',
    requiredPermissions: ['manage_pricing'],
    projectId: 'project-alpha'
  }
];

export const ApprovalProvider = ({ children }: { children: ReactNode }) => {
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [approvalActions, setApprovalActions] = useState<ApprovalAction[]>([]);
  const { currentUser, canAccess } = useRBAC();
  const { currentProject } = useProject();
  const { toast } = useToast();

  const createApprovalRequest = (request: Omit<ApprovalRequest, 'id' | 'requestedAt' | 'status'>): string => {
    const newRequest: ApprovalRequest = {
      ...request,
      id: `APR-${String(approvalRequests.length + 1).padStart(3, '0')}`,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      requestedBy: currentUser?.id || 'unknown',
      requestedByName: currentUser?.name || 'Unknown User',
      projectId: request.projectId || currentProject?.id
    };

    setApprovalRequests(prev => [newRequest, ...prev]);
    
    toast({
      title: "Approval Request Created",
      description: `${request.title} has been submitted for approval.`
    });

    return newRequest.id;
  };

  const updateRequestStatus = (requestId: string, status: ApprovalStatus, reason?: string) => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status,
              approver: currentUser?.id,
              approverName: currentUser?.name,
              approvedAt: new Date().toISOString(),
              rejectionReason: status === 'rejected' ? reason : undefined
            }
          : req
      )
    );

    const action: ApprovalAction = {
      id: `ACT-${String(approvalActions.length + 1).padStart(3, '0')}`,
      requestId,
      action: status as 'approved' | 'rejected' | 'cancelled',
      performedBy: currentUser?.id || 'unknown',
      performedByName: currentUser?.name || 'Unknown User',
      timestamp: new Date().toISOString(),
      reason
    };

    setApprovalActions(prev => [action, ...prev]);
  };

  const approveRequest = (requestId: string, reason?: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (!request) return;

    if (!canAccess(request.requiredPermissions)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to approve this request.",
        variant: "destructive"
      });
      return;
    }

    updateRequestStatus(requestId, 'approved', reason);
    
    toast({
      title: "Request Approved",
      description: `${request.title} has been approved.`
    });
  };

  const rejectRequest = (requestId: string, reason: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (!request) return;

    if (!canAccess(request.requiredPermissions)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to reject this request.",
        variant: "destructive"
      });
      return;
    }

    updateRequestStatus(requestId, 'rejected', reason);
    
    toast({
      title: "Request Rejected",
      description: `${request.title} has been rejected.`,
      variant: "destructive"
    });
  };

  const cancelRequest = (requestId: string, reason?: string) => {
    updateRequestStatus(requestId, 'cancelled', reason);
    
    toast({
      title: "Request Cancelled",
      description: "The approval request has been cancelled."
    });
  };

  const getPendingApprovals = () => {
    return approvalRequests.filter(req => req.status === 'pending');
  };

  const getApprovalsByType = (type: ApprovalType) => {
    return approvalRequests.filter(req => req.type === type);
  };

  const getUserPendingApprovals = () => {
    if (!currentUser) return [];
    
    return approvalRequests.filter(req => 
      req.status === 'pending' && 
      canAccess(req.requiredPermissions) &&
      (!req.projectId || req.projectId === currentProject?.id)
    );
  };

  const value = {
    approvalRequests,
    approvalActions,
    createApprovalRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    getPendingApprovals,
    getApprovalsByType,
    getUserPendingApprovals
  };

  return (
    <ApprovalContext.Provider value={value}>
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  const context = useContext(ApprovalContext);
  if (context === undefined) {
    throw new Error('useApproval must be used within an ApprovalProvider');
  }
  return context;
};
