
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, DollarSign, FileText, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingTransaction {
  id: string;
  type: 'fee' | 'commission' | 'reimbursement';
  agentName: string;
  amount: number;
  description: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

const mockTransactions: PendingTransaction[] = [
  {
    id: '1',
    type: 'commission',
    agentName: 'John Smith',
    amount: 2500,
    description: 'Q4 Sales Commission',
    submittedDate: '2024-01-15',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    type: 'reimbursement',
    agentName: 'Sarah Johnson',
    amount: 450,
    description: 'Travel Expenses - Client Meeting',
    submittedDate: '2024-01-14',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'fee',
    agentName: 'Mike Davis',
    amount: 800,
    description: 'Processing Fee Collection',
    submittedDate: '2024-01-13',
    status: 'pending',
    priority: 'low'
  }
];

export default function ApprovalWorkflow() {
  const [transactions, setTransactions] = useState<PendingTransaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, status: 'approved' as const } : t)
    );
    toast({
      title: "Transaction Approved",
      description: "The transaction has been successfully approved.",
    });
  };

  const handleReject = (id: string) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, status: 'rejected' as const } : t)
    );
    toast({
      title: "Transaction Rejected",
      description: "The transaction has been rejected.",
      variant: "destructive",
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesPriority = filterPriority === 'all' || transaction.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commission': return <DollarSign className="h-4 w-4" />;
      case 'reimbursement': return <FileText className="h-4 w-4" />;
      case 'fee': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Approval Workflow</h1>
        <p className="text-gray-600 mt-2">Review and approve pending transactions</p>
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
                placeholder="Search by agent name or description..."
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
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="reimbursement">Reimbursement</SelectItem>
                <SelectItem value="fee">Fee</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(transaction.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{transaction.agentName}</h3>
                      <p className="text-gray-600">{transaction.description}</p>
                      <p className="text-sm text-gray-500">Submitted: {transaction.submittedDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xl font-bold">${transaction.amount.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getPriorityColor(transaction.priority)}>
                        {transaction.priority.toUpperCase()}
                      </Badge>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {transaction.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(transaction.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(transaction.id)}
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

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
