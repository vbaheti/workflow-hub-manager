
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { performanceData } from './AgentAnalyticsUtils';

const AgentRankingsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance Rankings (Overall)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performanceData
            .sort((a, b) => b.efficiency - a.efficiency)
            .map((agent, index) => (
              <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.routes} routes • {agent.trainingCamps} camps</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="font-semibold">${agent.collections.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Collections</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-orange-600">{agent.citizensTrained}</p>
                      <p className="text-xs text-gray-500">Citizens Trained</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={agent.efficiency} className="w-20 h-2" />
                    <span className="text-sm font-medium">{agent.efficiency}%</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRankingsTable;
