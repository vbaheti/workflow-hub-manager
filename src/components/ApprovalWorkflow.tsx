
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApprovalWorkflow = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState('');
  const { toast } = useToast();

  const pendingApprovals = [
    {
      id: "APP-001",
      type: "Commission Approval",
      agent: "John Smith",
      amount: "$3,200",
      requestDate: "2024-01-15",
      priority: "high",
      description: "Q4 sales commission based on performance metrics",
      documents: ["sales_report.pdf", "commission_calculation.xlsx"],
      details: {
        baseSalary: "$45,000",
        commissionRate: "7.5%",
        salesVolume: "$42,667",
        targetAchievement: "128%"
      }
    },
    {
      id: "APP-002",
      type: "Reimbursement",
      agent: "Sarah Johnson",
      amount: "$675",
      requestDate: "2024-01-14",
      priority: "medium",
      description: "Travel expenses for client meetings and training",
      documents: ["receipts.pdf", "travel_log.xlsx"],
      details: {
        travelDays: "3",
        accommodation: "$450",
        meals: "$125",
        transportation: "$100"
      }
    },
    {
      id: "APP-003",
      type: "Fee Adjustment",
      agent: "Mike Davis",
      amount: "$1,100",
      requestDate: "2024-01-13",
      priority: "low",
      description: "Service fee adjustment due to client contract modification",
      documents: ["contract_amendment.pdf", "fee_structure.pdf"],
      details: {
        originalFee: "$2,500",
        adjustedFee: "$3,600",
        reason: "Scope expansion",
        clientApproval: "Yes"
      }
    }
  ];

  const approvedItems = [
    {
      id: "APP-004",
      type: "Commission Approval",
      agent: "Emily Chen",
      amount: "$2,890",
      approvedDate: "2024-01-12",
      approvedBy: "John Supervisor",
      status: "approved"
    },
    {
      id: "APP-005",
      type: "Reimbursement",
      agent: "Robert Wilson",
      amount: "$340",
      approvedDate: "2024-01-10",
      approvedBy: "Sarah Manager",
      status: "approved"
    }
  ];

  const rejectedItems = [
    {
      id: "APP-006",
      type: "Commission Approval",
      agent: "Alice Brown",
      amount: "$1,560",
      rejectedDate: "2024-01-09",
      rejectedBy: "John Supervisor",
      reason: "Incomplete documentation - missing sales verification",
      status: "rejected"
    }
  ];

  const handleApprove = (item: any) => {
    toast({
      title: "Item Approved",
      description: `${item.type} for ${item.agent} has been approved.`,
    });
  };

  const handleReject = (item: any) => {
    toast({
      title: "Item Rejected",
      description: `${item.type} for ${item.agent} has been rejected.`,
      variant: "destructive",
    });
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: <Badge className="bg-red-100 text-red-800">High Priority</Badge>,
      medium: <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>,
      low: <Badge className="bg-green-100 text-green-800">Low Priority</Badge>
    };
    return variants[priority as keyof typeof variants];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: <Badge className="bg-green-100 text-green-800">Approved</Badge>,
      rejected: <Badge className="bg-red-100 text-red-800">Rejected</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Approval Workflow</h2>
          <p className="text-muted-foreground">Review and approve pending transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {pendingApprovals.length} Pending
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({approvedItems.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected ({rejectedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring your review and approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.agent}</TableCell>
                      <TableCell className="font-semibold">{item.amount}</TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      <TableCell>{new Date(item.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review {selectedItem?.type}</DialogTitle>
                                <DialogDescription>
                                  Review details and approve or reject this request
                                </DialogDescription>
                              </DialogHeader>
                              {selectedItem && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="font-semibold">Agent:</label>
                                      <p>{selectedItem.agent}</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold">Amount:</label>
                                      <p className="text-lg font-bold">{selectedItem.amount}</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold">Request Date:</label>
                                      <p>{new Date(selectedItem.requestDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold">Priority:</label>
                                      <div className="mt-1">{getPriorityBadge(selectedItem.priority)}</div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="font-semibold">Description:</label>
                                    <p className="mt-1 text-muted-foreground">{selectedItem.description}</p>
                                  </div>

                                  <div>
                                    <label className="font-semibold">Details:</label>
                                    <div className="mt-2 grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded">
                                      {Object.entries(selectedItem.details).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                          <span className="capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                          <span className="font-medium text-sm">{value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="font-semibold">Documents:</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {selectedItem.documents.map((doc: string, index: number) => (
                                        <Badge key={index} variant="outline">{doc}</Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="font-semibold">Review Comments:</label>
                                    <Textarea
                                      placeholder="Add your review comments..."
                                      value={reviewComment}
                                      onChange={(e) => setReviewComment(e.target.value)}
                                      className="mt-2"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleReject(selectedItem)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => handleApprove(selectedItem)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Items</CardTitle>
              <CardDescription>Recently approved transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.agent}</TableCell>
                      <TableCell className="font-semibold">{item.amount}</TableCell>
                      <TableCell>{new Date(item.approvedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{item.approvedBy}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Items</CardTitle>
              <CardDescription>Items that were rejected with reasons</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rejected Date</TableHead>
                    <TableHead>Rejected By</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.agent}</TableCell>
                      <TableCell className="font-semibold">{item.amount}</TableCell>
                      <TableCell>{new Date(item.rejectedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{item.rejectedBy}</TableCell>
                      <TableCell className="text-red-600 text-sm">{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalWorkflow;
