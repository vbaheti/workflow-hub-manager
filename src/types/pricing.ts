
export interface PricingRule {
  id: string;
  serviceName: string;
  category: string;
  stage: 'initial' | 'processing' | 'completion' | 'delivery';
  pricingType: 'fixed' | 'percentage';
  amount: number;
  baseAmount?: number;
  isActive: boolean;
  projectId: string;
  version: number;
  createdAt: string;
  createdBy: string;
  ruleSetId: string;
}

export interface PricingHistory {
  id: string;
  ruleId: string;
  action: 'created' | 'updated' | 'deactivated';
  changes: Record<string, any>;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface StageRule {
  stage: 'initial' | 'processing' | 'completion' | 'delivery';
  amount: string;
  baseAmount?: string;
}

export interface NewRuleSet {
  serviceName: string;
  category: string;
  pricingType: 'fixed' | 'percentage';
  baseAmount: string;
  stages: {
    initial: StageRule;
    processing: StageRule;
    completion: StageRule;
    delivery: StageRule;
  };
}
