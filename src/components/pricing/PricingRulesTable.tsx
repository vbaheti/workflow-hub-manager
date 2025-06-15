
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PermissionGate from '../PermissionGate';

interface PricingRulesTableProps {
  groupedRules: Record<string, any>;
  onToggleStatus: (ruleSetId: string) => void;
}

export default function PricingRulesTable({ groupedRules, onToggleStatus }: PricingRulesTableProps) {
  return (
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
                const rulePricingType = rule.pricingType;
                return sum + (rulePricingType === 'fixed' ? rule.amount : rule.amount);
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
                        onClick={() => onToggleStatus(ruleSet.ruleSetId)}
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
  );
}
