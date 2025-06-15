
export interface Agent {
  id: number;
  name: string;
  assignedRoutes: string[];
  location: string;
  status: string;
  performance: string;
  totalCollections: string;
}

export const performanceData = [
  { name: 'Rajesh Kumar', collections: 45200, routes: 2, efficiency: 92, trainingCamps: 2, citizensTrained: 85 },
  { name: 'Priya Sharma', collections: 52100, routes: 2, efficiency: 95, trainingCamps: 3, citizensTrained: 110 },
  { name: 'Ahmed Hassan', collections: 41800, routes: 2, efficiency: 88, trainingCamps: 1, citizensTrained: 42 },
  { name: 'Fatima Al-Zahra', collections: 38900, routes: 2, efficiency: 85, trainingCamps: 2, citizensTrained: 68 },
  { name: 'Chen Wei Ming', collections: 29500, routes: 1, efficiency: 70, trainingCamps: 1, citizensTrained: 35 }
];

export const trainingMetrics = [
  { month: 'Jan', camps: 8, citizens: 420, meCompleted: 6 },
  { month: 'Feb', camps: 10, citizens: 485, meCompleted: 8 },
  { month: 'Mar', camps: 7, citizens: 365, meCompleted: 5 },
  { month: 'Apr', camps: 12, citizens: 580, meCompleted: 10 },
  { month: 'May', camps: 11, citizens: 525, meCompleted: 9 },
  { month: 'Jun', camps: 9, citizens: 450, meCompleted: 7 }
];

export const monthlyTrendsData = [
  { month: 'Jan', collections: 185000, agents: 5 },
  { month: 'Feb', collections: 195000, agents: 5 },
  { month: 'Mar', collections: 178000, agents: 5 },
  { month: 'Apr', collections: 208000, agents: 5 },
  { month: 'May', collections: 215000, agents: 5 },
  { month: 'Jun', collections: 207000, agents: 5 }
];

export const getStatusDistribution = (agents: Agent[]) => [
  { name: 'Active', value: agents.filter(a => a.status === 'active').length, color: '#10B981' },
  { name: 'Inactive', value: agents.filter(a => a.status === 'inactive').length, color: '#F59E0B' }
];

export const getPerformanceDistribution = (agents: Agent[]) => [
  { name: 'Excellent', value: agents.filter(a => a.performance === 'excellent').length, color: '#3B82F6' },
  { name: 'Good', value: agents.filter(a => a.performance === 'good').length, color: '#10B981' },
  { name: 'Average', value: agents.filter(a => a.performance === 'average').length, color: '#F59E0B' }
];

export const calculateMetrics = (agents: Agent[]) => {
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalRoutes = agents.reduce((sum, agent) => sum + agent.assignedRoutes.length, 0);
  const avgRoutesPerAgent = totalRoutes / activeAgents;

  const totalTrainingCamps = trainingMetrics.reduce((sum, m) => sum + m.camps, 0);
  const totalCitizensTrained = trainingMetrics.reduce((sum, m) => sum + m.citizens, 0);
  const avgCitizensPerCamp = totalCitizensTrained / totalTrainingCamps;

  return {
    totalAgents,
    activeAgents,
    totalRoutes,
    avgRoutesPerAgent,
    totalTrainingCamps,
    totalCitizensTrained,
    avgCitizensPerCamp
  };
};
