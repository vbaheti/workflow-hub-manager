
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Settings } from 'lucide-react';

interface PricingStatsProps {
  activeRuleSets: number;
  totalRuleSets: number;
  totalValue: number;
}

export default function PricingStats({ activeRuleSets, totalRuleSets, totalValue }: PricingStatsProps) {
  const avgValue = totalRuleSets > 0 ? Math.round(totalValue / totalRuleSets) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Rule Sets</CardTitle>
          <Settings className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{activeRuleSets}</div>
          <p className="text-xs text-muted-foreground">of {totalRuleSets} total</p>
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
            ${avgValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Per pricing rule set</p>
        </CardContent>
      </Card>
    </div>
  );
}
