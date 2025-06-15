
export interface TrainingCamp {
  id: string;
  agentId: number;
  agentName: string;
  trainerId: number;
  trainerName: string;
  campName: string;
  location: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  startDate: Date;
  endDate: Date;
  targetCitizens: number;
  registeredCitizens: number;
  completedCitizens: number;
  trainingType: 'skill_development' | 'awareness' | 'capacity_building' | 'livelihood';
  status: 'planned' | 'ongoing' | 'completed' | 'me_pending';
  meCompletedDate?: Date;
  meScore?: number;
  campFeedback?: string;
}

export interface TrainingType {
  value: string;
  label: string;
  color: string;
}

export interface TrainingStats {
  totalCamps: number;
  completedCamps: number;
  totalCitizensServed: number;
  avgCompletionRate: number;
  targetCamps: number;
  targetCitizens: number;
  campsAchievementRate: number;
  citizensAchievementRate: number;
}

export interface TrainingTarget {
  id: string;
  agentId: number;
  agentName: string;
  targetCamps: number;
  targetCitizens: number;
  actualCamps: number;
  actualCitizens: number;
  period: string;
}

export const trainingTypes: TrainingType[] = [
  { value: 'skill_development', label: 'Skill Development', color: 'bg-blue-100 text-blue-800' },
  { value: 'awareness', label: 'Awareness Program', color: 'bg-green-100 text-green-800' },
  { value: 'capacity_building', label: 'Capacity Building', color: 'bg-purple-100 text-purple-800' },
  { value: 'livelihood', label: 'Livelihood Training', color: 'bg-orange-100 text-orange-800' }
];

export const getStatusBadgeConfig = (status: string) => {
  const statusConfig = {
    planned: { label: 'Planned', color: 'bg-gray-100 text-gray-800' },
    ongoing: { label: 'Ongoing', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    me_pending: { label: 'M&E Pending', color: 'bg-yellow-100 text-yellow-800' }
  };
  return statusConfig[status as keyof typeof statusConfig];
};

export const getCompletionRate = (completed: number, target: number): number => {
  return target > 0 ? (completed / target) * 100 : 0;
};

export const getOverallStats = (camps: TrainingCamp[], targets: TrainingTarget[]): TrainingStats => {
  const totalCamps = camps.length;
  const completedCamps = camps.filter(c => c.status === 'completed').length;
  const totalCitizensServed = camps.reduce((sum, c) => sum + c.completedCitizens, 0);
  const avgCompletionRate = camps.length > 0 
    ? camps.reduce((sum, c) => sum + getCompletionRate(c.completedCitizens, c.targetCitizens), 0) / camps.length 
    : 0;

  const targetCamps = targets.reduce((sum, t) => sum + t.targetCamps, 0);
  const targetCitizens = targets.reduce((sum, t) => sum + t.targetCitizens, 0);
  const campsAchievementRate = targetCamps > 0 ? (totalCamps / targetCamps) * 100 : 0;
  const citizensAchievementRate = targetCitizens > 0 ? (totalCitizensServed / targetCitizens) * 100 : 0;

  return { 
    totalCamps, 
    completedCamps, 
    totalCitizensServed, 
    avgCompletionRate,
    targetCamps,
    targetCitizens,
    campsAchievementRate,
    citizensAchievementRate
  };
};

export const mockTrainingTargets: TrainingTarget[] = [
  {
    id: '1',
    agentId: 1,
    agentName: 'Rajesh Kumar',
    targetCamps: 5,
    targetCitizens: 200,
    actualCamps: 3,
    actualCitizens: 142,
    period: 'Q2 2024'
  },
  {
    id: '2',
    agentId: 2,
    agentName: 'Priya Sharma',
    targetCamps: 4,
    targetCitizens: 150,
    actualCamps: 4,
    actualCitizens: 168,
    period: 'Q2 2024'
  },
  {
    id: '3',
    agentId: 3,
    agentName: 'Ahmed Hassan',
    targetCamps: 3,
    targetCitizens: 120,
    actualCamps: 2,
    actualCitizens: 85,
    period: 'Q2 2024'
  }
];
