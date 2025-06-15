
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, DollarSign, FileText, Search, Filter, Users, MapPin, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApproval } from '../contexts/ApprovalContext';
import { ApprovalType } from '../types/approvals';
import { useIsMobile } from '../hooks/use-mobile';

export default function ApprovalWorkflow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const { approvalRequests, approveRequest, rejectRequest, getPendingApprovals } = useApproval();
  const isMobile = useIsMobile();

  const filteredRequests = approvalRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedByName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || request.type === filterType;
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: ApprovalType) => {
    switch (type) {
      case 'agent_onboarding': return <Users className="h-4 w-4" />;
      case 'pricing_change': return <DollarSign className="h-4 w-4" />;
      case 'commission_request': return <FileText className="h-4 w-4" />;
      case 'bank_details_update': return <Clock className="h-4 w-4" />;
      case 'route_assignment': return <MapPin className="h-4 w-4" />;
      case 'reimbursement_request': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ApprovalType) => {
    const labels: Record<ApprovalType, string> = {
      'agent_onboarding': 'Agent Onboarding',
      'pricing_change': 'Pricing Change',
      'commission_request': 'Commission Request',
      'bank_details_update': 'Bank Details Update',
      'route_assignment': 'Route Assignment',
      'reimbursement_request': 'Reimbursement Request'
    };
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = approvalRequests.filter(r => r.status === 'pending').length;
  const approvedCount = approvalRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = approvalRequests.filter(r => r.status === 'rejected').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: isMobile ? '2-digit' : 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Unified Approval Workflow</h1>
        <p className="text-sm sm:text-base text-gray-600">Review and approve all sensitive actions across the system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Rejected Today</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filter Toggle */}
      {isMobile && (
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center gap-2"
        >
          <Menu className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      )}

      {/* Filters */}
      {(!isMobile || showFilters) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, description, or requester..."
                  className="pl-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="agent_onboarding">Agent Onboarding</SelectItem>
                    <SelectItem value="pricing_change">Pricing Change</SelectItem>
                    <SelectItem value="commission_request">Commission Request</SelectItem>
                    <SelectItem value="bank_details_update">Bank Details Update</SelectItem>
                    <SelectItem value="route_assignment">Route Assignment</SelectItem>
                    <SelectItem value="reimbursement_request">Reimbursement Request</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-1">
                    {getTypeIcon(request.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-lg truncate">{request.title}</h3>
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(request.type)}
                          </Badge>
                          <Badge variant={getPriorityColor(request.priority)} className="text-xs">
                            {request.priority.toUpperCase()}
                          </Badge>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                      <p className="text-xs text-gray-500">
                        Requested by {request.requestedByName} • {formatDate(request.requestedAt)}
                      </p>
                      {request.approverName && (
                        <p className="text-xs text-gray-500">
                          {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approverName} • {request.approvedAt && formatDate(request.approvedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                      onClick={() => rejectRequest(request.id, 'Rejected by reviewer')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                      onClick={() => approveRequest(request.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Filter className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No approval requests found</h3>
            <p className="text-sm sm:text-base text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
