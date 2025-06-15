
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { performanceData } from './AgentAnalyticsUtils';

const AgentPerformanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Agent Collections & Training Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'collections') return [`$${value.toLocaleString()}`, 'Collections'];
                if (name === 'citizensTrained') return [`${value}`, 'Citizens Trained'];
                return [value, name];
              }} 
            />
            <Bar dataKey="collections" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="citizensTrained" fill="#F97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AgentPerformanceChart;
