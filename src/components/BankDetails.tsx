
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, CreditCard, Plus, Search, Edit, Trash2, Eye, EyeOff, Download, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '../contexts/RBACContext';
import PermissionGate from './PermissionGate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface BankAccount {
  id: string;
  employeeName: string;
  employeeId: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  isDefault: boolean;
  isVerified: boolean;
  addedDate: string;
  projectId: string;
}

interface PaymentLedgerEntry {
  id: string;
  employeeId: string;
  date: string;
  amount: number;
  serviceReference: string;
  projectReference: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    employeeId: 'EMP001',
    bankName: 'Chase Bank',
    accountNumber: '****1234',
    routingNumber: '021000021',
    accountType: 'checking',
    isDefault: true,
    isVerified: true,
    addedDate: '2024-01-15',
    projectId: 'project-alpha'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    employeeId: 'EMP002',
    bankName: 'Bank of America',
    accountNumber: '****5678',
    routingNumber: '021000322',
    accountType: 'savings',
    isDefault: false,
    isVerified: true,
    addedDate: '2024-01-10',
    projectId: 'project-beta'
  },
  {
    id: '3',
    employeeName: 'Mike Davis',
    employeeId: 'EMP003',
    bankName: 'Wells Fargo',
    accountNumber: '****9012',
    routingNumber: '121000248',
    accountType: 'checking',
    isDefault: false,
    isVerified: false,
    addedDate: '2024-01-08',
    projectId: 'project-alpha'
  }
];

const mockPaymentLedger: PaymentLedgerEntry[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    date: '2024-06-10',
    amount: 1250.00,
    serviceReference: 'Birth Certificate Processing',
    projectReference: 'project-alpha',
    status: 'completed',
    transactionId: 'TXN001'
  },
  {
    id: '2',
    employeeId: 'EMP001',
    date: '2024-06-08',
    amount: 875.50,
    serviceReference: 'Passport Application',
    projectReference: 'project-alpha',
    status: 'completed',
    transactionId: 'TXN002'
  },
  {
    id: '3',
    employeeId: 'EMP002',
    date: '2024-06-09',
    amount: 2100.00,
    serviceReference: 'Driver License Renewal',
    projectReference: 'project-beta',
    status: 'pending',
    transactionId: 'TXN003'
  }
];

export default function BankDetails() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [paymentLedger] = useState<PaymentLedgerEntry[]>(mockPaymentLedger);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBank, setFilterBank] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const { toast } = useToast();
  const { hasPermission } = useRBAC();

  const canEditBankDetails = hasPermission('manage_bank_details');

  const filteredBankAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBank = filterBank === 'all' || account.bankName === filterBank;
    const matchesType = filterType === 'all' || account.accountType === filterType;
    const matchesProject = filterProject === 'all' || account.projectId === filterProject;
    
    return matchesSearch && matchesBank && matchesType && matchesProject;
  });

  const getAgentLedger = (employeeId: string) => {
    return paymentLedger.filter(entry => entry.employeeId === employeeId);
  };

  const handleSetDefault = (id: string) => {
    if (!canEditBankDetails) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to modify bank details.",
        variant: "destructive",
      });
      return;
    }

    setBankAccounts(prev => 
      prev.map(account => ({ 
        ...account, 
        isDefault: account.id === id 
      }))
    );
    toast({
      title: "Default Account Updated",
      description: "The selected account has been set as default.",
    });
  };

  const handleVerify = (id: string) => {
    if (!canEditBankDetails) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to verify bank accounts.",
        variant: "destructive",
      });
      return;
    }

    setBankAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, isVerified: true } : account
      )
    );
    toast({
      title: "Account Verified",
      description: "The bank account has been successfully verified.",
    });
  };

  const handleDelete = (id: string) => {
    if (!canEditBankDetails) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete bank accounts.",
        variant: "destructive",
      });
      return;
    }

    setBankAccounts(prev => prev.filter(account => account.id !== id));
    toast({
      title: "Account Deleted",
      description: "The bank account has been removed.",
      variant: "destructive",
    });
  };

  const exportLedgerToCSV = (employeeId?: string) => {
    const ledgerData = employeeId ? getAgentLedger(employeeId) : paymentLedger;
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Amount', 'Service Reference', 'Project Reference', 'Status', 'Transaction ID'];
    
    const csvContent = [
      headers.join(','),
      ...ledgerData.map(entry => {
        const account = bankAccounts.find(acc => acc.employeeId === entry.employeeId);
        return [
          entry.date,
          entry.employeeId,
          account?.employeeName || 'Unknown',
          entry.amount.toFixed(2),
          `"${entry.serviceReference}"`,
          entry.projectReference,
          entry.status,
          entry.transactionId
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payment_ledger_${employeeId || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Payment ledger has been exported to CSV.",
    });
  };

  const totalAccounts = bankAccounts.length;
  const verifiedAccounts = bankAccounts.filter(a => a.isVerified).length;
  const pendingAccounts = bankAccounts.filter(a => !a.isVerified).length;
  const uniqueBanks = new Set(bankAccounts.map(a => a.bankName)).size;

  return (
    <PermissionGate permissions={['view_agents', 'manage_bank_details']} requireAll={false}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bank Details</h1>
            <p className="text-gray-600 mt-2">Manage agent banking information for payments</p>
          </div>
          <PermissionGate permissions={['manage_bank_details']}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </PermissionGate>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-blue-600">{totalAccounts}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Accounts</p>
                  <p className="text-2xl font-bold text-green-600">{verifiedAccounts}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingAccounts}</p>
                </div>
                <Building className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Partner Banks</p>
                  <p className="text-2xl font-bold text-purple-600">{uniqueBanks}</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Agent Bank Accounts</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                >
                  {showAccountNumbers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showAccountNumbers ? 'Hide' : 'Show'} Account Numbers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportLedgerToCSV()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Ledgers
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by agent, bank, or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterBank} onValueChange={setFilterBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  <SelectItem value="Chase Bank">Chase Bank</SelectItem>
                  <SelectItem value="Bank of America">Bank of America</SelectItem>
                  <SelectItem value="Wells Fargo">Wells Fargo</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="project-alpha">Project Alpha</SelectItem>
                  <SelectItem value="project-beta">Project Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts List */}
        <div className="space-y-4">
          {filteredBankAccounts.map((account) => {
            const agentLedger = getAgentLedger(account.employeeId);
            const totalPayments = agentLedger.reduce((sum, entry) => sum + entry.amount, 0);
            
            return (
              <Card key={account.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Account Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Building className="h-8 w-8 text-gray-400" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{account.employeeName}</h3>
                            <Badge variant="outline">{account.employeeId}</Badge>
                            {account.isDefault && (
                              <Badge className="bg-blue-100 text-blue-800">DEFAULT</Badge>
                            )}
                            {account.isVerified ? (
                              <Badge className="bg-green-100 text-green-800">VERIFIED</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{account.bankName}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Account:</span> {showAccountNumbers ? account.accountNumber.replace('****', '1234567890'.substring(0, 6)) : account.accountNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Routing:</span> {account.routingNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Type:</span> {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Project:</span> {account.projectId}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Payments</p>
                          <p className="text-lg font-bold text-green-600">${totalPayments.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportLedgerToCSV(account.employeeId)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <PermissionGate permissions={['manage_bank_details']}>
                            <>
                              {!account.isDefault && account.isVerified && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSetDefault(account.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              {!account.isVerified && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleVerify(account.id)}
                                >
                                  Verify
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(account.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          </PermissionGate>
                        </div>
                      </div>
                    </div>

                    {/* Payment Ledger */}
                    {agentLedger.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Payment History ({agentLedger.length} transactions)
                          </h4>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Transaction ID</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {agentLedger.map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell className="font-mono text-sm">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="font-semibold text-green-600">
                                    ${entry.amount.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="max-w-xs truncate">
                                    {entry.serviceReference}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      entry.status === 'completed' ? 'default' :
                                      entry.status === 'pending' ? 'secondary' : 'destructive'
                                    }>
                                      {entry.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">
                                    {entry.transactionId}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBankAccounts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bank accounts found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new bank account.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PermissionGate>
  );
}
