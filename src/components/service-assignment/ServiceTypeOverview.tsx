
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, GraduationCap, Target } from 'lucide-react';

interface ServiceTypeStat {
  serviceType: string;
  serviceName: string;
  unit: string;
  assignmentCount: number;
  totalTarget: number;
  totalProgress: number;
  progressPercentage: number;
  activeAgents: number;
}

interface ServiceTypeOverviewProps {
  serviceTypeStats: ServiceTypeStat[];
  formatValue: (value: number, unit: string) => string;
}

const ServiceTypeOverview = ({ serviceTypeStats, formatValue }: ServiceTypeOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Service Type Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {serviceTypeStats.map((serviceStat) => (
            <div key={serviceStat.serviceType} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(serviceStat.serviceType === 'training_camps' || serviceStat.serviceType === 'training_citizens') && (
                    <GraduationCap className="h-5 w-5 text-orange-600" />
                  )}
                  <div>
                    <h4 className="font-semibold text-lg">{serviceStat.serviceName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {serviceStat.assignmentCount} assignments • {serviceStat.activeAgents} agents
                    </p>
                  </div>
                </div>
                <Badge variant={serviceStat.progressPercentage >= 90 ? 'default' : 
                              serviceStat.progressPercentage >= 70 ? 'secondary' : 'destructive'}>
                  {serviceStat.progressPercentage.toFixed(0)}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{serviceStat.progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={serviceStat.progressPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {formatValue(serviceStat.totalProgress, serviceStat.unit)} achieved
                  </span>
                  <span>
                    Target: {formatValue(serviceStat.totalTarget, serviceStat.unit)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-600">{serviceStat.assignmentCount}</p>
                  <p className="text-xs text-muted-foreground">Assignments</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-green-600">{serviceStat.activeAgents}</p>
                  <p className="text-xs text-muted-foreground">Active Agents</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-purple-600">
                    {serviceStat.totalTarget > 0 ? Math.round(serviceStat.totalTarget / serviceStat.assignmentCount) : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Target</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {serviceTypeStats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No service assignments yet. Create your first assignment to see progress tracking.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTypeOverview;
