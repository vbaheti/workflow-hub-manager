
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Search, Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewReimbursementForm from './NewReimbursementForm';

interface Reimbursement {
  id: string;
  employeeName: string;
  project: string;
  category: string;
  amount: number;
  description: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  receiptUrl?: string;
}

const mockReimbursements: Reimbursement[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    project: 'Project Alpha',
    category: 'Travel',
    amount: 450.00,
    description: 'Flight tickets for client meeting in Chicago',
    submittedDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    project: 'Project Beta',
    category: 'Meals',
    amount: 75.50,
    description: 'Business lunch with prospective client',
    submittedDate: '2024-01-14',
    status: 'approved'
  },
  {
    id: '3',
    employeeName: 'Mike Davis',
    project: 'Project Alpha',
    category: 'Office Supplies',
    amount: 120.00,
    description: 'Stationery and printing materials',
    submittedDate: '2024-01-13',
    status: 'processing'
  },
  {
    id: '4',
    employeeName: 'Emily Brown',
    project: 'Project Gamma',
    category: 'Travel',
    amount: 85.00,
    description: 'Taxi fare for airport transfer',
    submittedDate: '2024-01-12',
    status: 'rejected'
  }
];

export default function Reimbursements() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(mockReimbursements);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const { toast } = useToast();

  const projects = Array.from(new Set(reimbursements.map(r => r.project)));

  const filteredReimbursements = reimbursements.filter(reimbursement => {
    const matchesSearch = reimbursement.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reimbursement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reimbursement.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || reimbursement.status === filterStatus;
    const matchesProject = filterProject === 'all' || reimbursement.project === filterProject;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesProject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected' | 'processing') => {
    setReimbursements(prev => 
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
    toast({
      title: "Status Updated",
      description: `Reimbursement has been ${newStatus}.`,
    });
  };

  const handleNewReimbursement = (newReimbursement: Reimbursement) => {
    setReimbursements(prev => [newReimbursement, ...prev]);
  };

  const totalAmount = reimbursements.reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = reimbursements.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const approvedAmount = reimbursements.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0);
  const pendingCount = reimbursements.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reimbursements</h1>
          <p className="text-gray-600 mt-2">Manage employee expense reimbursements across projects</p>
        </div>
        <NewReimbursementForm onSubmit={handleNewReimbursement} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold text-green-600">${approvedAmount.toFixed(2)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by employee or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Meals">Meals</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
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
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursements List */}
      <div className="space-y-4">
        {filteredReimbursements.map((reimbursement) => (
          <Card key={reimbursement.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Receipt className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-lg">{reimbursement.employeeName}</h3>
                    <p className="text-gray-600">{reimbursement.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{reimbursement.project}</Badge>
                      <Badge variant="outline">{reimbursement.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {reimbursement.submittedDate}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xl font-bold">${reimbursement.amount.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(reimbursement.status)}`}>
                        {getStatusIcon(reimbursement.status)}
                        <span className="ml-1">{reimbursement.status.toUpperCase()}</span>
                      </span>
                    </div>
                  </div>
                  
                  {reimbursement.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleStatusChange(reimbursement.id, 'rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleStatusChange(reimbursement.id, 'processing')}
                      >
                        Process
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(reimbursement.id, 'approved')}
                      >
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

      {filteredReimbursements.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reimbursements found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
