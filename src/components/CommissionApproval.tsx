
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, CheckCircle, XCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommissionRequest {
  id: string;
  agentName: string;
  serviceType: string;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  clientName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
}

const mockCommissionRequests: CommissionRequest[] = [
  {
    id: 'COM-001',
    agentName: 'John Smith',
    serviceType: 'Legal Consultation',
    baseAmount: 5000,
    commissionRate: 15,
    commissionAmount: 750,
    clientName: 'ABC Corp',
    requestDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: 'COM-002',
    agentName: 'Sarah Johnson',
    serviceType: 'Document Processing',
    baseAmount: 3200,
    commissionRate: 12,
    commissionAmount: 384,
    clientName: 'XYZ Ltd',
    requestDate: '2024-01-14',
    status: 'approved',
    approvedBy: 'Supervisor Mike',
    approvalDate: '2024-01-15'
  },
  {
    id: 'COM-003',
    agentName: 'Mike Davis',
    serviceType: 'Consultation',
    baseAmount: 2800,
    commissionRate: 10,
    commissionAmount: 280,
    clientName: 'DEF Industries',
    requestDate: '2024-01-13',
    status: 'rejected',
    approvedBy: 'Supervisor Mike',
    approvalDate: '2024-01-14',
    notes: 'Incomplete documentation'
  }
];

export default function CommissionApproval() {
  const [commissionRequests, setCommissionRequests] = useState<CommissionRequest[]>(mockCommissionRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const filteredRequests = commissionRequests.filter(request => {
    const matchesSearch = request.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      approved: <Badge className="bg-green-100 text-green-800">Approved</Badge>,
      rejected: <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const handleApproval = (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setCommissionRequests(commissionRequests.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status, 
            approvedBy: 'Current Supervisor',
            approvalDate: new Date().toISOString().split('T')[0],
            notes 
          }
        : request
    ));
    
    toast({
      title: "Success",
      description: `Commission request ${status} successfully`
    });
  };

  const totalPending = commissionRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.commissionAmount, 0);
  const totalApproved = commissionRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.commissionAmount, 0);
  const pendingCount = commissionRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Commission Approval</h2>
          <p className="text-muted-foreground">Review and approve agent commission requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">${totalPending.toLocaleString()} value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalApproved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${commissionRequests.length > 0 ? Math.round(commissionRequests.reduce((sum, r) => sum + r.commissionAmount, 0) / commissionRequests.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per request</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{commissionRequests.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Requests</CardTitle>
          <CardDescription>Review and approve commission requests from agents</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Base Amount</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Commission Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.agentName}</TableCell>
                  <TableCell>{request.serviceType}</TableCell>
                  <TableCell>${request.baseAmount.toLocaleString()}</TableCell>
                  <TableCell>{request.commissionRate}%</TableCell>
                  <TableCell className="font-semibold">${request.commissionAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproval(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleApproval(request.id, 'rejected', 'Rejected by supervisor')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <span className="text-sm text-muted-foreground">
                        {request.approvedBy} on {request.approvalDate && new Date(request.approvalDate).toLocaleDateString()}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
