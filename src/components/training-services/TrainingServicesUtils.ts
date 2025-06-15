
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
