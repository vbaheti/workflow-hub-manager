
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, DollarSign, Award } from 'lucide-react';
import { Agent, calculateMetrics } from './AgentAnalyticsUtils';

interface AgentMetricsCardsProps {
  agents: Agent[];
}

const AgentMetricsCards = ({ agents }: AgentMetricsCardsProps) => {
  const metrics = calculateMetrics(agents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.totalAgents}</p>
              <p className="text-xs text-green-600">↑ {metrics.activeAgents} active</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Camps</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.totalTrainingCamps}</p>
              <p className="text-xs text-blue-600">6 months total</p>
            </div>
            <GraduationCap className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citizens Trained</p>
              <p className="text-2xl font-bold text-green-600">{metrics.totalCitizensTrained}</p>
              <p className="text-xs text-green-600">≈ {metrics.avgCitizensPerCamp.toFixed(0)} per camp</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Collections</p>
              <p className="text-2xl font-bold text-purple-600">$41,500</p>
              <p className="text-xs text-green-600">↑ 12% vs last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-lg font-bold text-orange-600">Priya Sharma</p>
              <p className="text-xs text-green-600">95% efficiency</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentMetricsCards;
