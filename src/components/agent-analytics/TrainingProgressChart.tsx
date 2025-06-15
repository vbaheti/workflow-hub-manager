
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap } from 'lucide-react';
import { trainingMetrics } from './AgentAnalyticsUtils';

const TrainingProgressChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Monthly Training Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trainingMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="camps" stroke="#F97316" strokeWidth={3} name="Training Camps" />
            <Line type="monotone" dataKey="citizens" stroke="#10B981" strokeWidth={3} name="Citizens Trained" />
            <Line type="monotone" dataKey="meCompleted" stroke="#8B5CF6" strokeWidth={3} name="M&E Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrainingProgressChart;
