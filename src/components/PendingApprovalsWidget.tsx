
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useApproval } from '../contexts/ApprovalContext';
import { useRBAC } from '../contexts/RBACContext';
import { ApprovalRequest } from '../types/approvals';

export default function PendingApprovalsWidget() {
  const { getUserPendingApprovals, approveRequest, rejectRequest } = useApproval();
  const { hasPermission } = useRBAC();
  const pendingApprovals = getUserPendingApprovals();

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Pending Approvals ({pendingApprovals.length})
        </CardTitle>
        <CardDescription>
          Actions requiring your approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingApprovals.slice(0, 5).map((request) => (
          <div key={request.id} className="flex items-start justify-between p-3 border rounded-lg">
            <div className="flex items-start space-x-3 flex-1">
              <span className="text-lg">{getTypeIcon(request.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{request.title}</h4>
                  <Badge variant={getPriorityColor(request.priority)} className="text-xs">
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
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                onClick={() => rejectRequest(request.id, 'Rejected from dashboard')}
              >
                <XCircle className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 px-2"
                onClick={() => approveRequest(request.id)}
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {pendingApprovals.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm">
              View All ({pendingApprovals.length - 5} more)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
