
import { useMemo } from 'react';

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

// Mock data that would typically come from agent app
const mockTrainingCamps: TrainingCamp[] = [
  {
    id: '1',
    agentId: 1,
    agentName: 'Rajesh Kumar',
    trainerId: 101,
    trainerName: 'Dr. Priya Sharma',
    campName: 'Digital Literacy Training',
    location: 'Dharavi Community Center',
    state: 'Maharashtra',
    district: 'Mumbai',
    taluk: 'Mumbai City',
    village: 'Dharavi',
    startDate: new Date('2024-06-10'),
    endDate: new Date('2024-06-15'),
    targetCitizens: 50,
    registeredCitizens: 45,
    completedCitizens: 42,
    trainingType: 'skill_development',
    status: 'me_pending',
    meScore: 85,
    campFeedback: 'Excellent participation and engagement'
  },
  {
    id: '2',
    agentId: 2,
    agentName: 'Priya Sharma',
    trainerId: 102,
    trainerName: 'Prof. Amit Patel',
    campName: 'Health Awareness Program',
    location: 'Govandi Primary School',
    state: 'Maharashtra',
    district: 'Mumbai',
    taluk: 'Mumbai City',
    village: 'Govandi',
    startDate: new Date('2024-06-20'),
    endDate: new Date('2024-06-22'),
    targetCitizens: 75,
    registeredCitizens: 68,
    completedCitizens: 68,
    trainingType: 'awareness',
    status: 'completed',
    meScore: 92,
    campFeedback: 'Good engagement, need to improve attendance'
  }
];

export const useTrainingData = () => {
  const getAgentTrainingStats = (agentId: number) => {
    const agentCamps = mockTrainingCamps.filter(camp => camp.agentId === agentId);
    const totalCamps = agentCamps.length;
    const completedCamps = agentCamps.filter(camp => camp.status === 'completed').length;
    const totalCitizensTrained = agentCamps.reduce((sum, camp) => sum + camp.completedCitizens, 0);
    const pendingMECamps = agentCamps.filter(camp => camp.status === 'me_pending').length;
    
    return {
      totalCamps,
      completedCamps,
      totalCitizensTrained,
      pendingMECamps
    };
  };

  const getOverallTrainingStats = () => {
    const totalCamps = mockTrainingCamps.length;
    const completedCamps = mockTrainingCamps.filter(camp => camp.status === 'completed').length;
    const totalCitizensTrained = mockTrainingCamps.reduce((sum, camp) => sum + camp.completedCitizens, 0);
    const avgCitizensPerCamp = totalCamps > 0 ? totalCitizensTrained / totalCamps : 0;
    const completionRate = totalCamps > 0 ? (completedCamps / totalCamps) * 100 : 0;
    
    return {
      totalCamps,
      completedCamps,
      totalCitizensTrained,
      avgCitizensPerCamp,
      completionRate
    };
  };

  const getTrainingCampsByAgent = (agentId: number) => {
    return mockTrainingCamps.filter(camp => camp.agentId === agentId);
  };

  return {
    trainingCamps: mockTrainingCamps,
    getAgentTrainingStats,
    getOverallTrainingStats,
    getTrainingCampsByAgent
  };
};
