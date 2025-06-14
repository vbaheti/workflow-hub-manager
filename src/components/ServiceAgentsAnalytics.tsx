
import React from 'react';
import AgentAnalytics from './AgentAnalytics';

interface ServiceAgentsAnalyticsProps {
  agents: any[];
}

const ServiceAgentsAnalytics: React.FC<ServiceAgentsAnalyticsProps> = ({ agents }) => (
  <AgentAnalytics agents={agents} />
);

export default ServiceAgentsAnalytics;
