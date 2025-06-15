
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Save, X, DollarSign, TrendingUp, Settings, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '../contexts/ProjectContext';
import { useRBAC } from '../contexts/RBACContext';
import PermissionGate from './PermissionGate';

interface PricingRule {
  id: string;
  serviceName: string;
  category: string;
  stage: 'initial' | 'processing' | 'completion' | 'delivery';
  pricingType: 'fixed' | 'percentage';
  amount: number;
  baseAmount?: number; // for percentage calculations
  isActive: boolean;
  projectId: string;
  version: number;
  createdAt: string;
  createdBy: string;
}

interface PricingHistory {
  id: string;
  ruleId: string;
  action: 'created' | 'updated' | 'deactivated';
  changes: Record<string, any>;
  timestamp: string;
  userId: string;
  userName: string;
}

const mockPricingRules: PricingRule[] = [
  {
    id: 'PR-001',
    serviceName: 'Legal Consultation',
    category: 'Legal Services',
    stage: 'initial',
    pricingType: 'fixed',
    amount: 5000,
    isActive: true,
    projectId: 'project-alpha',
    version: 1,
    createdAt: '2024-01-15',
    createdBy: 'Manager'
  },
  {
    id: 'PR-002',
    serviceName: 'Legal Consultation',
    category: 'Legal Services',
    stage: 'completion',
    pricingType: 'percentage',
    amount: 15,
    baseAmount: 5000,
    isActive: true,
    projectId: 'project-alpha',
    version: 1,
    createdAt: '2024-01-15',
    createdBy: 'Manager'
  }
];

const mockHistory: PricingHistory[] = [
  {
    id: 'PH-001',
    ruleId: 'PR-001',
    action: 'created',
    changes: { amount: 5000 },
    timestamp: '2024-01-15T10:00:00Z',
    userId: 'U-001',
    userName: 'John Manager'
  }
];

export default function ServicePricingManagement() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(mockPricingRules);
  const [history, setHistory] = useState<PricingHistory[]>(mockHistory);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const { toast } = useToast();
  const { currentProject } = useProject();
  const { hasPermission, currentUser } = useRBAC();

  const [newRule, setNewRule] = useState({
    serviceName: '',
    category: '',
    stage: 'initial' as const,
    pricingType: 'fixed' as const,
    amount: '',
    baseAmount: ''
  });

  const categories = ['Legal Services', 'Administrative', 'Registration', 'Financial', 'Consultation'];
  const stages = [
    { value: 'initial', label: 'Initial Payment' },
    { value: 'processing', label: 'Processing Fee' },
    { value: 'completion', label: 'Completion Fee' },
    { value: 'delivery', label: 'Delivery Charge' }
  ];

  const canEdit = hasPermission('manage_pricing');
  const projectRules = pricingRules.filter(rule => rule.projectId === currentProject?.id);

  const handleAddRule = () => {
    if (!newRule.serviceName || !newRule.category || !newRule.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (newRule.pricingType === 'percentage' && !newRule.baseAmount) {
      toast({
        title: "Error",
        description: "Base amount is required for percentage pricing",
        variant: "destructive"
      });
      return;
    }

    const rule: PricingRule = {
      id: `PR-${String(pricingRules.length + 1).padStart(3, '0')}`,
      serviceName: newRule.serviceName,
      category: newRule.category,
      stage: newRule.stage,
      pricingType: newRule.pricingType,
      amount: parseFloat(newRule.amount),
      baseAmount: newRule.baseAmount ? parseFloat(newRule.baseAmount) : undefined,
      isActive: true,
      projectId: currentProject?.id || '',
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser?.name || 'Current User'
    };

    setPricingRules([...pricingRules, rule]);
    addToHistory(rule.id, 'created', { amount: rule.amount, pricingType: rule.pricingType });
    setNewRule({ serviceName: '', category: '', stage: 'initial', pricingType: 'fixed', amount: '', baseAmount: '' });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Pricing rule added successfully"
    });
  };

  const handleUpdateRule = (rule: PricingRule) => {
    const oldRule = pricingRules.find(r => r.id === rule.id);
    const changes: Record<string, any> = {};
    
    if (oldRule) {
      if (oldRule.amount !== rule.amount) changes.amount = { from: oldRule.amount, to: rule.amount };
      if (oldRule.pricingType !== rule.pricingType) changes.pricingType = { from: oldRule.pricingType, to: rule.pricingType };
    }

    setPricingRules(pricingRules.map(r => 
      r.id === rule.id 
        ? { ...rule, version: r.version + 1, createdAt: new Date().toISOString().split('T')[0] }
        : r
    ));
    
    addToHistory(rule.id, 'updated', changes);
    setEditingRule(null);
    
    toast({
      title: "Success",
      description: "Pricing rule updated successfully"
    });
  };

  const toggleRuleStatus = (id: string) => {
    const rule = pricingRules.find(r => r.id === id);
    setPricingRules(pricingRules.map(r => 
      r.id === id 
        ? { ...r, isActive: !r.isActive, version: r.version + 1 }
        : r
    ));
    
    addToHistory(id, 'deactivated', { isActive: !rule?.isActive });
    
    toast({
      title: "Success",
      description: "Rule status updated successfully"
    });
  };

  const addToHistory = (ruleId: string, action: PricingHistory['action'], changes: Record<string, any>) => {
    const historyEntry: PricingHistory = {
      id: `PH-${String(history.length + 1).padStart(3, '0')}`,
      ruleId,
      action,
      changes,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'current-user',
      userName: currentUser?.name || 'Current User'
    };
    setHistory([historyEntry, ...history]);
  };

  const activeRules = projectRules.filter(r => r.isActive).length;
  const totalValue = projectRules.reduce((sum, r) => sum + (r.pricingType === 'fixed' ? r.amount : r.baseAmount || 0), 0);

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Please select a project to manage pricing rules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Pricing - {currentProject.name}</h2>
          <p className="text-muted-foreground">Manage project-specific pricing rules and commission rates</p>
        </div>
        <PermissionGate permissions={['manage_pricing']}>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Pricing Rule
          </Button>
        </PermissionGate>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rules</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeRules}</div>
            <p className="text-xs text-muted-foreground">of {projectRules.length} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Base Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined base amounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rule Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${projectRules.length > 0 ? Math.round(totalValue / projectRules.length).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per pricing rule</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Add/Edit Rule Form */}
          {(showAddForm || editingRule) && (
            <PermissionGate permissions={['manage_pricing']}>
              <Card>
                <CardHeader>
                  <CardTitle>{editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        value={editingRule ? editingRule.serviceName : newRule.serviceName}
                        onChange={(e) => editingRule 
                          ? setEditingRule({...editingRule, serviceName: e.target.value})
                          : setNewRule({...newRule, serviceName: e.target.value})
                        }
                        placeholder="Enter service name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={editingRule ? editingRule.category : newRule.category}
                        onValueChange={(value) => editingRule
                          ? setEditingRule({...editingRule, category: value})
                          : setNewRule({...newRule, category: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stage">Pricing Stage</Label>
                      <Select 
                        value={editingRule ? editingRule.stage : newRule.stage}
                        onValueChange={(value: any) => editingRule
                          ? setEditingRule({...editingRule, stage: value})
                          : setNewRule({...newRule, stage: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map(stage => (
                            <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pricingType">Pricing Type</Label>
                      <Select 
                        value={editingRule ? editingRule.pricingType : newRule.pricingType}
                        onValueChange={(value: any) => editingRule
                          ? setEditingRule({...editingRule, pricingType: value})
                          : setNewRule({...newRule, pricingType: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">
                        {(editingRule ? editingRule.pricingType : newRule.pricingType) === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={editingRule ? editingRule.amount : newRule.amount}
                        onChange={(e) => editingRule
                          ? setEditingRule({...editingRule, amount: parseFloat(e.target.value) || 0})
                          : setNewRule({...newRule, amount: e.target.value})
                        }
                        placeholder={`Enter ${(editingRule ? editingRule.pricingType : newRule.pricingType) === 'percentage' ? 'percentage' : 'amount'}`}
                      />
                    </div>
                    {((editingRule ? editingRule.pricingType : newRule.pricingType) === 'percentage') && (
                      <div>
                        <Label htmlFor="baseAmount">Base Amount ($)</Label>
                        <Input
                          id="baseAmount"
                          type="number"
                          value={editingRule ? editingRule.baseAmount || '' : newRule.baseAmount}
                          onChange={(e) => editingRule
                            ? setEditingRule({...editingRule, baseAmount: parseFloat(e.target.value) || 0})
                            : setNewRule({...newRule, baseAmount: e.target.value})
                          }
                          placeholder="Enter base amount for percentage calculation"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={editingRule ? () => handleUpdateRule(editingRule) : handleAddRule}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingRule ? 'Update Rule' : 'Add Rule'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingRule(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PermissionGate>
          )}

          {/* Pricing Rules Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Pricing Rules</CardTitle>
              <CardDescription>Project-specific pricing configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.serviceName}</TableCell>
                      <TableCell>{rule.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {stages.find(s => s.value === rule.stage)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.pricingType === 'fixed' ? 'default' : 'secondary'}>
                          {rule.pricingType === 'fixed' ? 'Fixed' : 'Percentage'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {rule.pricingType === 'fixed' 
                          ? `$${rule.amount.toLocaleString()}`
                          : `${rule.amount}% of $${rule.baseAmount?.toLocaleString()}`
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={rule.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>v{rule.version}</TableCell>
                      <TableCell>
                        <PermissionGate permissions={['manage_pricing']}>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingRule(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleRuleStatus(rule.id)}
                            >
                              {rule.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </PermissionGate>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>Audit trail of all pricing changes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Rule ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{entry.ruleId}</TableCell>
                      <TableCell>
                        <Badge variant={
                          entry.action === 'created' ? 'default' :
                          entry.action === 'updated' ? 'secondary' : 'destructive'
                        }>
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-xs text-muted-foreground">
                          {JSON.stringify(entry.changes, null, 2)}
                        </div>
                      </TableCell>
                      <TableCell>{entry.userName}</TableCell>
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
}
