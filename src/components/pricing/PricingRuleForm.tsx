
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { NewRuleSet } from '../../types/pricing';

interface PricingRuleFormProps {
  newRuleSet: NewRuleSet;
  setNewRuleSet: React.Dispatch<React.SetStateAction<NewRuleSet>>;
  onSubmit: () => void;
  onCancel: () => void;
  calculateTotal: () => number;
}

const categories = ['Legal Services', 'Administrative', 'Registration', 'Financial', 'Consultation'];
const stages = [
  { value: 'initial', label: 'Initial Payment' },
  { value: 'processing', label: 'Processing Fee' },
  { value: 'completion', label: 'Completion Fee' },
  { value: 'delivery', label: 'Delivery Charge' }
];

export default function PricingRuleForm({ 
  newRuleSet, 
  setNewRuleSet, 
  onSubmit, 
  onCancel, 
  calculateTotal 
}: PricingRuleFormProps) {
  return (
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
              onValueChange={(value: 'fixed' | 'percentage') => setNewRuleSet({...newRuleSet, pricingType: value})}
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
          <Button onClick={onSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Add Rule Set
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
