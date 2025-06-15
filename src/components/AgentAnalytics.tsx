
import React from 'react';
import AgentMetricsCards from './agent-analytics/AgentMetricsCards';
import AgentPerformanceChart from './agent-analytics/AgentPerformanceChart';
import TrainingProgressChart from './agent-analytics/TrainingProgressChart';
import CollectionsTrendChart from './agent-analytics/CollectionsTrendChart';
import PerformanceDistributionChart from './agent-analytics/PerformanceDistributionChart';
import AgentRankingsTable from './agent-analytics/AgentRankingsTable';
import TrainingMEStatus from './agent-analytics/TrainingMEStatus';

interface Agent {
  id: number;
  name: string;
  assignedRoutes: string[];
  location: string;
  status: string;
  performance: string;
  totalCollections: string;
}

interface AgentAnalyticsProps {
  agents: Agent[];
}

const AgentAnalytics = ({ agents }: AgentAnalyticsProps) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <AgentMetricsCards agents={agents} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance Chart */}
        <AgentPerformanceChart />

        {/* Training Progress Tracking */}
        <TrainingProgressChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Collections Trend */}
        <CollectionsTrendChart />

        {/* Performance Distribution */}
        <PerformanceDistributionChart agents={agents} />
      </div>

      {/* Agent Efficiency Rankings with Training Metrics */}
      <AgentRankingsTable />

      {/* Training Camp M&E Status */}
      <TrainingMEStatus />
    </div>
  );
};

export default AgentAnalytics;
