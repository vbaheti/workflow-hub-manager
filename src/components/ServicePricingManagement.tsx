
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
  ruleSetId: string; // Links all 4 stages together
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

interface StageRule {
  stage: 'initial' | 'processing' | 'completion' | 'delivery';
  amount: string;
  baseAmount?: string;
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
    createdBy: 'Manager',
    ruleSetId: 'RS-001'
  },
  {
    id: 'PR-002',
    serviceName: 'Legal Consultation',
    category: 'Legal Services',
    stage: 'processing',
    pricingType: 'fixed',
    amount: 3000,
    isActive: true,
    projectId: 'project-alpha',
    version: 1,
    createdAt: '2024-01-15',
    createdBy: 'Manager',
    ruleSetId: 'RS-001'
  },
  {
    id: 'PR-003',
    serviceName: 'Legal Consultation',
    category: 'Legal Services',
    stage: 'completion',
    pricingType: 'fixed',
    amount: 1500,
    isActive: true,
    projectId: 'project-alpha',
    version: 1,
    createdAt: '2024-01-15',
    createdBy: 'Manager',
    ruleSetId: 'RS-001'
  },
  {
    id: 'PR-004',
    serviceName: 'Legal Consultation',
    category: 'Legal Services',
    stage: 'delivery',
    pricingType: 'fixed',
    amount: 500,
    isActive: true,
    projectId: 'project-alpha',
    version: 1,
    createdAt: '2024-01-15',
    createdBy: 'Manager',
    ruleSetId: 'RS-001'
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
  const [editingRuleSet, setEditingRuleSet] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentProject } = useProject();
  const { hasPermission, currentUser } = useRBAC();

  const [newRuleSet, setNewRuleSet] = useState({
    serviceName: '',
    category: '',
    pricingType: 'fixed' as const,
    baseAmount: '',
    stages: {
      initial: { stage: 'initial' as const, amount: '', baseAmount: '' },
      processing: { stage: 'processing' as const, amount: '', baseAmount: '' },
      completion: { stage: 'completion' as const, amount: '', baseAmount: '' },
      delivery: { stage: 'delivery' as const, amount: '', baseAmount: '' }
    }
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

  // Group rules by service and category
  const groupedRules = projectRules.reduce((acc, rule) => {
    const key = `${rule.serviceName}-${rule.category}-${rule.ruleSetId}`;
    if (!acc[key]) {
      acc[key] = {
        serviceName: rule.serviceName,
        category: rule.category,
        pricingType: rule.pricingType,
        ruleSetId: rule.ruleSetId,
        version: rule.version,
        isActive: rule.isActive,
        stages: {}
      };
    }
    acc[key].stages[rule.stage] = rule;
    return acc;
  }, {} as Record<string, any>);

  const calculateTotal = () => {
    if (newRuleSet.pricingType === 'fixed') {
      return Object.values(newRuleSet.stages).reduce((sum, stage) => {
        return sum + (parseFloat(stage.amount) || 0);
      }, 0);
    } else {
      return Object.values(newRuleSet.stages).reduce((sum, stage) => {
        return sum + (parseFloat(stage.amount) || 0);
      }, 0);
    }
  };

  const validateRuleSet = () => {
    // Check if all required fields are filled
    if (!newRuleSet.serviceName || !newRuleSet.category) {
      return "Please fill in service name and category";
    }

    // Check if all stage amounts are filled
    const stageAmounts = Object.values(newRuleSet.stages);
    if (stageAmounts.some(stage => !stage.amount)) {
      return "Please fill in amounts for all stages";
    }

    // For percentage type, check if total equals 100%
    if (newRuleSet.pricingType === 'percentage') {
      if (!newRuleSet.baseAmount) {
        return "Base amount is required for percentage pricing";
      }
      const total = calculateTotal();
      if (Math.abs(total - 100) > 0.01) {
        return `Percentage total must equal 100%. Current total: ${total.toFixed(2)}%`;
      }
    }

    return null;
  };

  const handleAddRuleSet = () => {
    const validationError = validateRuleSet();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    const ruleSetId = `RS-${String(Object.keys(groupedRules).length + 1).padStart(3, '0')}`;
    const newRules: PricingRule[] = [];

    Object.entries(newRuleSet.stages).forEach(([stageKey, stage], index) => {
      const rule: PricingRule = {
        id: `PR-${String(pricingRules.length + index + 1).padStart(3, '0')}`,
        serviceName: newRuleSet.serviceName,
        category: newRuleSet.category,
        stage: stage.stage,
        pricingType: newRuleSet.pricingType,
        amount: parseFloat(stage.amount),
        baseAmount: newRuleSet.baseAmount ? parseFloat(newRuleSet.baseAmount) : undefined,
        isActive: true,
        projectId: currentProject?.id || '',
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: currentUser?.name || 'Current User',
        ruleSetId: ruleSetId
      };
      newRules.push(rule);
    });

    setPricingRules([...pricingRules, ...newRules]);
    
    // Add to history for each rule
    newRules.forEach(rule => {
      addToHistory(rule.id, 'created', { amount: rule.amount, pricingType: rule.pricingType });
    });

    // Reset form
    setNewRuleSet({
      serviceName: '',
      category: '',
      pricingType: 'fixed',
      baseAmount: '',
      stages: {
        initial: { stage: 'initial', amount: '', baseAmount: '' },
        processing: { stage: 'processing', amount: '', baseAmount: '' },
        completion: { stage: 'completion', amount: '', baseAmount: '' },
        delivery: { stage: 'delivery', amount: '', baseAmount: '' }
      }
    });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Pricing rule set added successfully"
    });
  };

  const toggleRuleSetStatus = (ruleSetId: string) => {
    const ruleSetRules = pricingRules.filter(r => r.ruleSetId === ruleSetId);
    const newStatus = !ruleSetRules[0]?.isActive;
    
    setPricingRules(pricingRules.map(r => 
      r.ruleSetId === ruleSetId 
        ? { ...r, isActive: newStatus, version: r.version + 1 }
        : r
    ));
    
    ruleSetRules.forEach(rule => {
      addToHistory(rule.id, 'deactivated', { isActive: newStatus });
    });
    
    toast({
      title: "Success",
      description: "Rule set status updated successfully"
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

  const activeRuleSets = Object.values(groupedRules).filter(rs => rs.isActive).length;
  const totalValue = Object.values(groupedRules).reduce((sum, rs) => {
    const stageValues = Object.values(rs.stages).reduce((stageSum: number, rule: any) => {
      return stageSum + (rule.pricingType === 'fixed' ? rule.amount : rule.baseAmount || 0);
    }, 0);
    return sum + stageValues;
  }, 0);

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
          <p className="text-muted-foreground">Manage project-specific pricing rules with all 4 stages</p>
        </div>
        <PermissionGate permissions={['manage_pricing']}>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Pricing Rule Set
          </Button>
        </PermissionGate>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rule Sets</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeRuleSets}</div>
            <p className="text-xs text-muted-foreground">of {Object.keys(groupedRules).length} total</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rule Set Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${Object.keys(groupedRules).length > 0 ? Math.round(totalValue / Object.keys(groupedRules).length).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per pricing rule set</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Pricing Rule Sets</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Add/Edit Rule Set Form */}
          {showAddForm && (
            <PermissionGate permissions={['manage_pricing']}>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Pricing Rule Set</CardTitle>
                  <CardDescription>Define pricing for all 4 stages of a service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        value={newRuleSet.serviceName}
                        onChange={(e) => setNewRuleSet({...newRuleSet, serviceName: e.target.value})}
                        placeholder="Enter service name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newRuleSet.category}
                        onValueChange={(value) => setNewRuleSet({...newRuleSet, category: value})}
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
                      <Label htmlFor="pricingType">Pricing Type</Label>
                      <Select 
                        value={newRuleSet.pricingType}
                        onValueChange={(value: any) => setNewRuleSet({...newRuleSet, pricingType: value})}
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
                  </div>

                  {newRuleSet.pricingType === 'percentage' && (
                    <div>
                      <Label htmlFor="baseAmount">Base Amount ($)</Label>
                      <Input
                        id="baseAmount"
                        type="number"
                        value={newRuleSet.baseAmount}
                        onChange={(e) => setNewRuleSet({...newRuleSet, baseAmount: e.target.value})}
                        placeholder="Enter base amount for percentage calculation"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-base font-semibold">Stage Breakdown</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                      {stages.map(stage => (
                        <div key={stage.value} className="space-y-2 p-4 border rounded-lg">
                          <Label className="font-medium">{stage.label}</Label>
                          <Input
                            type="number"
                            value={newRuleSet.stages[stage.value as keyof typeof newRuleSet.stages].amount}
                            onChange={(e) => setNewRuleSet({
                              ...newRuleSet,
                              stages: {
                                ...newRuleSet.stages,
                                [stage.value]: {
                                  ...newRuleSet.stages[stage.value as keyof typeof newRuleSet.stages],
                                  amount: e.target.value
                                }
                              }
                            })}
                            placeholder={newRuleSet.pricingType === 'percentage' ? '% of base' : 'Amount ($)'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold">
                      {newRuleSet.pricingType === 'fixed' 
                        ? `$${calculateTotal().toLocaleString()}`
                        : `${calculateTotal().toFixed(2)}%`
                      }
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddRuleSet}>
                      <Save className="h-4 w-4 mr-2" />
                      Add Rule Set
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PermissionGate>
          )}

          {/* Pricing Rule Sets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Pricing Rule Sets</CardTitle>
              <CardDescription>Project-specific pricing configuration with all stages</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Initial</TableHead>
                    <TableHead>Processing</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(groupedRules).map((ruleSet: any) => {
                    const total = Object.values(ruleSet.stages).reduce((sum: number, rule: any) => {
                      return sum + (rule.pricingType === 'fixed' ? rule.amount : rule.amount);
                    }, 0);
                    
                    return (
                      <TableRow key={ruleSet.ruleSetId}>
                        <TableCell className="font-medium">{ruleSet.serviceName}</TableCell>
                        <TableCell>{ruleSet.category}</TableCell>
                        <TableCell>
                          <Badge variant={ruleSet.pricingType === 'fixed' ? 'default' : 'secondary'}>
                            {ruleSet.pricingType === 'fixed' ? 'Fixed' : 'Percentage'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {ruleSet.pricingType === 'fixed' 
                            ? `$${ruleSet.stages.initial?.amount?.toLocaleString() || 0}`
                            : `${ruleSet.stages.initial?.amount || 0}%`
                          }
                        </TableCell>
                        <TableCell className="font-semibold">
                          {ruleSet.pricingType === 'fixed' 
                            ? `$${ruleSet.stages.processing?.amount?.toLocaleString() || 0}`
                            : `${ruleSet.stages.processing?.amount || 0}%`
                          }
                        </TableCell>
                        <TableCell className="font-semibold">
                          {ruleSet.pricingType === 'fixed' 
                            ? `$${ruleSet.stages.completion?.amount?.toLocaleString() || 0}`
                            : `${ruleSet.stages.completion?.amount || 0}%`
                          }
                        </TableCell>
                        <TableCell className="font-semibold">
                          {ruleSet.pricingType === 'fixed' 
                            ? `$${ruleSet.stages.delivery?.amount?.toLocaleString() || 0}`
                            : `${ruleSet.stages.delivery?.amount || 0}%`
                          }
                        </TableCell>
                        <TableCell className="font-bold text-blue-600">
                          {ruleSet.pricingType === 'fixed' 
                            ? `$${total.toLocaleString()}`
                            : `${total}%`
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={ruleSet.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {ruleSet.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <PermissionGate permissions={['manage_pricing']}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleRuleSetStatus(ruleSet.ruleSetId)}
                            >
                              {ruleSet.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </PermissionGate>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
