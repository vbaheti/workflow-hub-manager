
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const FinancialTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const transactions = [
    {
      id: "TXN-001",
      agent: "John Smith",
      type: "Fee Collection",
      amount: 2450.00,
      status: "completed",
      date: "2024-01-15",
      description: "Monthly service fee collection",
      approvedBy: "Sarah Manager"
    },
    {
      id: "TXN-002",
      agent: "Emily Chen",
      type: "Commission",
      amount: 890.50,
      status: "pending",
      date: "2024-01-14",
      description: "Q4 performance commission",
      approvedBy: null
    },
    {
      id: "TXN-003",
      agent: "Mike Davis",
      type: "Reimbursement",
      amount: 340.75,
      status: "approved",
      date: "2024-01-13",
      description: "Travel expenses reimbursement",
      approvedBy: "John Supervisor"
    },
    {
      id: "TXN-004",
      agent: "Sarah Johnson",
      type: "Fee Collection",
      amount: 1200.00,
      status: "completed",
      date: "2024-01-12",
      description: "Client onboarding fees",
      approvedBy: "Sarah Manager"
    },
    {
      id: "TXN-005",
      agent: "Robert Wilson",
      type: "Commission",
      amount: 675.25,
      status: "rejected",
      date: "2024-01-11",
      description: "Sales commission - incomplete documentation",
      approvedBy: "John Supervisor"
    }
  ];

  const stats = [
    {
      title: "Total Volume",
      value: "$156,890",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Pending Approvals",
      value: "8",
      change: "-15%",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Completed",
      value: "247",
      change: "+8.2%",
      icon: CheckCircle,
      color: "text-blue-600"
    },
    {
      title: "Growth",
      value: "18.5%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: <Badge className="bg-green-100 text-green-800">Completed</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      approved: <Badge className="bg-blue-100 text-blue-800">Approved</Badge>,
      rejected: <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Transactions</h2>
          <p className="text-muted-foreground">Manage all financial transactions and approvals</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="fees">Fee Collections</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete overview of all financial transactions</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
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
                      <SelectItem value="completed">Completed</SelectItem>
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
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.agent}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="font-semibold">
                        ${transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.approvedBy || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Collections</CardTitle>
              <CardDescription>Track all fee collection transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fee collection details will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission Payments</CardTitle>
              <CardDescription>Manage commission approvals and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Commission details will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursements</CardTitle>
              <CardDescription>Process expense reimbursements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reimbursement details will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialTransactions;
