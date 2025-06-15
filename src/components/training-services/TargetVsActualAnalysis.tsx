
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { TrainingTarget, getCompletionRate } from './TrainingServicesUtils';

interface TargetVsActualAnalysisProps {
  targets: TrainingTarget[];
}

const TargetVsActualAnalysis = ({ targets }: TargetVsActualAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Target vs Actual Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {targets.map((target) => {
            const campsAchievement = getCompletionRate(target.actualCamps, target.targetCamps);
            const citizensAchievement = getCompletionRate(target.actualCitizens, target.targetCitizens);
            
            return (
              <div key={target.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{target.agentName}</h4>
                    <p className="text-sm text-muted-foreground">{target.period}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={campsAchievement >= 100 && citizensAchievement >= 100 ? "default" : "secondary"}>
                      {campsAchievement >= 100 && citizensAchievement >= 100 ? "Target Met" : "In Progress"}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Training Camps Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Training Camps</span>
                      <div className="flex items-center gap-1">
                        {campsAchievement >= 100 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="text-sm font-bold">{campsAchievement.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={Math.min(campsAchievement, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Actual: {target.actualCamps}</span>
                      <span>Target: {target.targetCamps}</span>
                    </div>
                  </div>
                  
                  {/* Citizens Trained Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Citizens Trained</span>
                      <div className="flex items-center gap-1">
                        {citizensAchievement >= 100 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="text-sm font-bold">{citizensAchievement.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={Math.min(citizensAchievement, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Actual: {target.actualCitizens}</span>
                      <span>Target: {target.targetCitizens}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TargetVsActualAnalysis;
