
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap } from 'lucide-react';
import { trainingMetrics } from './AgentAnalyticsUtils';

const TrainingMEStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Training Camp M&E Completion Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {trainingMetrics.map((month) => {
            const completionRate = (month.meCompleted / month.camps) * 100;
            return (
              <div key={month.month} className="text-center p-4 border rounded-lg">
                <p className="font-semibold text-lg">{month.month}</p>
                <p className="text-2xl font-bold text-orange-600">{month.camps}</p>
                <p className="text-xs text-gray-500">Camps</p>
                <Progress value={completionRate} className="mt-2 h-2" />
                <p className="text-xs mt-1">{month.meCompleted}/{month.camps} M&E Complete</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingMEStatus;
