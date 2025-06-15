
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '../contexts/ProjectContext';
import { useRBAC } from '../contexts/RBACContext';
import PermissionGate from './PermissionGate';
import PricingStats from './pricing/PricingStats';
import PricingRuleForm from './pricing/PricingRuleForm';
import PricingRulesTable from './pricing/PricingRulesTable';
import PricingHistory from './pricing/PricingHistory';
import { PricingRule, PricingHistory as PricingHistoryType, NewRuleSet } from '../types/pricing';

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

const mockHistory: PricingHistoryType[] = [
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
  const [history, setHistory] = useState<PricingHistoryType[]>(mockHistory);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const { currentProject } = useProject();
  const { currentUser } = useRBAC();

  const [newRuleSet, setNewRuleSet] = useState<NewRuleSet>({
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
    const stageAmounts = Object.values(newRuleSet.stages);
    return stageAmounts.reduce((sum, stage) => {
      return sum + (parseFloat(stage.amount) || 0);
    }, 0);
  };

  const validateRuleSet = () => {
    if (!newRuleSet.serviceName || !newRuleSet.category) {
      return "Please fill in service name and category";
    }

    const stageAmounts = Object.values(newRuleSet.stages);
    if (stageAmounts.some(stage => !stage.amount)) {
      return "Please fill in amounts for all stages";
    }

    const currentPricingType = newRuleSet.pricingType;
    if (currentPricingType === 'percentage') {
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
    
    newRules.forEach(rule => {
      addToHistory(rule.id, 'created', { amount: rule.amount, pricingType: rule.pricingType });
    });

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

  const addToHistory = (ruleId: string, action: PricingHistoryType['action'], changes: Record<string, any>) => {
    const historyEntry: PricingHistoryType = {
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
      const ruleType = rule.pricingType;
      return stageSum + (ruleType === 'fixed' ? rule.amount : rule.baseAmount || 0);
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

      <PricingStats 
        activeRuleSets={activeRuleSets}
        totalRuleSets={Object.keys(groupedRules).length}
        totalValue={totalValue}
      />

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Pricing Rule Sets</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {showAddForm && (
            <PermissionGate permissions={['manage_pricing']}>
              <PricingRuleForm
                newRuleSet={newRuleSet}
                setNewRuleSet={setNewRuleSet}
                onSubmit={handleAddRuleSet}
                onCancel={() => setShowAddForm(false)}
                calculateTotal={calculateTotal}
              />
            </PermissionGate>
          )}

          <PricingRulesTable
            groupedRules={groupedRules}
            onToggleStatus={toggleRuleSetStatus}
          />
        </TabsContent>

        <TabsContent value="history">
          <PricingHistory history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
