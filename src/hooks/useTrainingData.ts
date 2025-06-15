
import { useState, useMemo } from 'react';
import { TrainingCamp, TrainingTarget, TrainingStats, getCompletionRate } from '@/components/training-services/TrainingServicesUtils';

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

const mockTrainingTargets: TrainingTarget[] = [
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

export const useTrainingData = () => {
  const [camps] = useState<TrainingCamp[]>(mockTrainingCamps);
  const [targets, setTargets] = useState<TrainingTarget[]>(mockTrainingTargets);

  const overallStats = useMemo((): TrainingStats => {
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
  }, [camps, targets]);

  const handleUpdateTarget = (updatedTarget: TrainingTarget) => {
    setTargets(prev => prev.map(target => 
      target.id === updatedTarget.id ? updatedTarget : target
    ));
  };

  return {
    camps,
    targets,
    overallStats,
    handleUpdateTarget,
  };
};
