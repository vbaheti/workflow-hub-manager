
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, Plus, DollarSign, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeeRecord {
  id: string;
  agentName: string;
  clientName: string;
  serviceType: string;
  feeAmount: number;
  collectionDate: string;
  status: 'collected' | 'pending' | 'overdue';
  dueDate: string;
  paymentMethod: string;
}

const mockFeeRecords: FeeRecord[] = [
  {
    id: 'FEE-001',
    agentName: 'John Smith',
    clientName: 'ABC Corp',
    serviceType: 'Consultation',
    feeAmount: 2500,
    collectionDate: '2024-01-15',
    status: 'collected',
    dueDate: '2024-01-10',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'FEE-002',
    agentName: 'Sarah Johnson',
    clientName: 'XYZ Ltd',
    serviceType: 'Legal Services',
    feeAmount: 4200,
    collectionDate: '',
    status: 'pending',
    dueDate: '2024-01-20',
    paymentMethod: 'Pending'
  },
  {
    id: 'FEE-003',
    agentName: 'Mike Davis',
    clientName: 'DEF Industries',
    serviceType: 'Documentation',
    feeAmount: 1800,
    collectionDate: '',
    status: 'overdue',
    dueDate: '2024-01-05',
    paymentMethod: 'Pending'
  }
];

export default function FeeCollection() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(mockFeeRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newFee, setNewFee] = useState({
    agentName: '',
    clientName: '',
    serviceType: '',
    feeAmount: '',
    dueDate: ''
  });

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      collected: <Badge className="bg-green-100 text-green-800">Collected</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      overdue: <Badge className="bg-red-100 text-red-800">Overdue</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const handleAddFee = () => {
    if (!newFee.agentName || !newFee.clientName || !newFee.feeAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const feeRecord: FeeRecord = {
      id: `FEE-${String(feeRecords.length + 1).padStart(3, '0')}`,
      agentName: newFee.agentName,
      clientName: newFee.clientName,
      serviceType: newFee.serviceType,
      feeAmount: parseFloat(newFee.feeAmount),
      collectionDate: '',
      status: 'pending',
      dueDate: newFee.dueDate,
      paymentMethod: 'Pending'
    };

    setFeeRecords([...feeRecords, feeRecord]);
    setNewFee({ agentName: '', clientName: '', serviceType: '', feeAmount: '', dueDate: '' });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Fee record added successfully"
    });
  };

  const markAsCollected = (id: string) => {
    setFeeRecords(feeRecords.map(record => 
      record.id === id 
        ? { ...record, status: 'collected' as const, collectionDate: new Date().toISOString().split('T')[0] }
        : record
    ));
    
    toast({
      title: "Success",
      description: "Fee marked as collected"
    });
  };

  const totalCollected = feeRecords.filter(r => r.status === 'collected').reduce((sum, r) => sum + r.feeAmount, 0);
  const totalPending = feeRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.feeAmount, 0);
  const totalOverdue = feeRecords.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.feeAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fee Collection</h2>
          <p className="text-muted-foreground">Track and manage service fee collections</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Fee Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{feeRecords.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Fee Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Fee Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agentName">Agent Name</Label>
                <Input
                  id="agentName"
                  value={newFee.agentName}
                  onChange={(e) => setNewFee({...newFee, agentName: e.target.value})}
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={newFee.clientName}
                  onChange={(e) => setNewFee({...newFee, clientName: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Input
                  id="serviceType"
                  value={newFee.serviceType}
                  onChange={(e) => setNewFee({...newFee, serviceType: e.target.value})}
                  placeholder="Enter service type"
                />
              </div>
              <div>
                <Label htmlFor="feeAmount">Fee Amount</Label>
                <Input
                  id="feeAmount"
                  type="number"
                  value={newFee.feeAmount}
                  onChange={(e) => setNewFee({...newFee, feeAmount: e.target.value})}
                  placeholder="Enter fee amount"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newFee.dueDate}
                  onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFee}>Add Fee Record</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fee Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Collection Records</CardTitle>
          <CardDescription>Manage all fee collection activities</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
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
                  <SelectItem value="collected">Collected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee ID</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.agentName}</TableCell>
                  <TableCell>{record.clientName}</TableCell>
                  <TableCell>{record.serviceType}</TableCell>
                  <TableCell className="font-semibold">${record.feeAmount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {record.status !== 'collected' && (
                      <Button 
                        size="sm" 
                        onClick={() => markAsCollected(record.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Collected
                      </Button>
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
