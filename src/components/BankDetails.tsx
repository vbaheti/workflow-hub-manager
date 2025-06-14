
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, CreditCard, Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankAccount {
  id: string;
  employeeName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  isDefault: boolean;
  isVerified: boolean;
  addedDate: string;
}

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    bankName: 'Chase Bank',
    accountNumber: '****1234',
    routingNumber: '021000021',
    accountType: 'checking',
    isDefault: true,
    isVerified: true,
    addedDate: '2024-01-15'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    bankName: 'Bank of America',
    accountNumber: '****5678',
    routingNumber: '021000322',
    accountType: 'savings',
    isDefault: false,
    isVerified: true,
    addedDate: '2024-01-10'
  },
  {
    id: '3',
    employeeName: 'Mike Davis',
    bankName: 'Wells Fargo',
    accountNumber: '****9012',
    routingNumber: '121000248',
    accountType: 'checking',
    isDefault: false,
    isVerified: false,
    addedDate: '2024-01-08'
  }
];

export default function BankDetails() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBank, setFilterBank] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const { toast } = useToast();

  const filteredBankAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBank = filterBank === 'all' || account.bankName === filterBank;
    const matchesType = filterType === 'all' || account.accountType === filterType;
    
    return matchesSearch && matchesBank && matchesType;
  });

  const handleSetDefault = (id: string) => {
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
    setBankAccounts(prev => prev.filter(account => account.id !== id));
    toast({
      title: "Account Deleted",
      description: "The bank account has been removed.",
      variant: "destructive",
    });
  };

  const totalAccounts = bankAccounts.length;
  const verifiedAccounts = bankAccounts.filter(a => a.isVerified).length;
  const pendingAccounts = bankAccounts.filter(a => !a.isVerified).length;
  const uniqueBanks = new Set(bankAccounts.map(a => a.bankName)).size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bank Details</h1>
          <p className="text-gray-600 mt-2">Manage employee banking information for payments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
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
            <CardTitle>Bank Accounts</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAccountNumbers(!showAccountNumbers)}
            >
              {showAccountNumbers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showAccountNumbers ? 'Hide' : 'Show'} Account Numbers
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by employee or bank..."
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
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts List */}
      <div className="space-y-4">
        {filteredBankAccounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Building className="h-8 w-8 text-gray-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{account.employeeName}</h3>
                      {account.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          DEFAULT
                        </span>
                      )}
                      {account.isVerified ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          PENDING
                        </span>
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
                        <span className="font-medium">Added:</span> {account.addedDate}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
  );
}
