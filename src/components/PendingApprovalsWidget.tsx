
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useApproval } from '../contexts/ApprovalContext';
import { useRBAC } from '../contexts/RBACContext';
import { ApprovalRequest } from '../types/approvals';
import { useIsMobile } from '../hooks/use-mobile';

export default function PendingApprovalsWidget() {
  const { getUserPendingApprovals, approveRequest, rejectRequest } = useApproval();
  const { hasPermission } = useRBAC();
  const pendingApprovals = getUserPendingApprovals();
  const isMobile = useIsMobile();

  if (pendingApprovals.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'agent_onboarding': return '👤';
      case 'pricing_change': return '💰';
      case 'commission_request': return '📊';
      case 'bank_details_update': return '🏦';
      case 'route_assignment': return '🗺️';
      case 'reimbursement_request': return '💳';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          Pending Approvals ({pendingApprovals.length})
        </CardTitle>
        <CardDescription className="text-sm">
          Actions requiring your approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {pendingApprovals.slice(0, 5).map((request) => (
          <div key={request.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 border rounded-lg gap-3">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <span className="text-base sm:text-lg flex-shrink-0">{getTypeIcon(request.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{request.title}</h4>
                  <Badge variant={getPriorityColor(request.priority)} className="text-xs w-fit">
                    {request.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Requested by {request.requestedByName} • {formatDate(request.requestedAt)}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {request.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-1 sm:ml-2 sm:flex-col lg:flex-row">
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 flex-1 sm:flex-none"
                onClick={() => rejectRequest(request.id, 'Rejected from dashboard')}
              >
                <XCircle className="h-3 w-3 sm:mr-0 lg:mr-1" />
                {!isMobile && <span className="hidden lg:inline">Reject</span>}
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 px-2 flex-1 sm:flex-none"
                onClick={() => approveRequest(request.id)}
              >
                <CheckCircle className="h-3 w-3 sm:mr-0 lg:mr-1" />
                {!isMobile && <span className="hidden lg:inline">Approve</span>}
              </Button>
            </div>
          </div>
        ))}
        
        {pendingApprovals.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View All ({pendingApprovals.length - 5} more)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
