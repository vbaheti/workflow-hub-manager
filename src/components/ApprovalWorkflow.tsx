
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, DollarSign, FileText, Search, Filter, Users, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApproval } from '../contexts/ApprovalContext';
import { ApprovalType } from '../types/approvals';

export default function ApprovalWorkflow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();
  const { approvalRequests, approveRequest, rejectRequest, getPendingApprovals } = useApproval();

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
    switch (type) {
      case 'agent_onboarding': return 'Agent Onboarding';
      case 'pricing_change': return 'Pricing Change';
      case 'commission_request': return 'Commission Request';
      case 'bank_details_update': return 'Bank Details Update';
      case 'route_assignment': return 'Route Assignment';
      case 'reimbursement_request': return 'Reimbursement Request';
      default: return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Unified Approval Workflow</h1>
        <p className="text-gray-600 mt-2">Review and approve all sensitive actions across the system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title, description, or requester..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
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
        </CardContent>
      </Card>

      {/* Approval Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(request.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <p className="text-gray-600">{request.description}</p>
                      <p className="text-sm text-gray-500">
                        Requested by {request.requestedByName} • {formatDate(request.requestedAt)}
                      </p>
                      {request.approverName && (
                        <p className="text-sm text-gray-500">
                          {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approverName} • {request.approvedAt && formatDate(request.approvedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">
                        {getTypeLabel(request.type)}
                      </Badge>
                      <Badge variant={getPriorityColor(request.priority)}>
                        {request.priority.toUpperCase()}
                      </Badge>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => rejectRequest(request.id, 'Rejected by reviewer')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => approveRequest(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approval requests found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
