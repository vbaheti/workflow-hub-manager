
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingCamp, TrainingTarget, TrainingStats, getCompletionRate } from '@/components/training-services/TrainingServicesUtils';

export const useTrainingData = () => {
  const [camps, setCamps] = useState<TrainingCamp[]>([]);
  const [targets, setTargets] = useState<TrainingTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainingCamps = async () => {
    try {
      const { data, error } = await supabase
        .from('training_camps')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedCamps: TrainingCamp[] = (data || []).map(camp => ({
        id: camp.id,
        agentId: camp.agent_id,
        agentName: camp.agent_name,
        trainerId: camp.trainer_id || 0,
        trainerName: camp.trainer_name || '',
        campName: camp.camp_name,
        location: camp.location,
        state: camp.state,
        district: camp.district || '',
        taluk: camp.taluk || '',
        village: camp.village || '',
        startDate: new Date(camp.start_date),
        endDate: new Date(camp.end_date),
        targetCitizens: camp.target_citizens,
        registeredCitizens: camp.registered_citizens,
        completedCitizens: camp.completed_citizens,
        trainingType: camp.training_type as any,
        status: camp.status as any,
        meCompletedDate: camp.me_completed_date ? new Date(camp.me_completed_date) : undefined,
        meScore: camp.me_score || undefined,
        campFeedback: camp.camp_feedback || undefined
      }));

      setCamps(formattedCamps);
    } catch (error: any) {
      console.error('Error fetching training camps:', error);
      setError(error.message);
    }
  };

  const fetchTrainingTargets = async () => {
    try {
      const { data, error } = await supabase
        .from('training_targets')
        .select('*')
        .order('period');

      if (error) throw error;

      const formattedTargets: TrainingTarget[] = (data || []).map(target => ({
        id: target.id,
        agentId: target.agent_id,
        agentName: target.agent_name,
        targetCamps: target.target_camps,
        targetCitizens: target.target_citizens,
        actualCamps: target.actual_camps,
        actualCitizens: target.actual_citizens,
        period: target.period
      }));

      setTargets(formattedTargets);
    } catch (error: any) {
      console.error('Error fetching training targets:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTrainingCamps(), fetchTrainingTargets()]);
      setLoading(false);
    };

    fetchData();
  }, []);

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

  const handleUpdateTarget = async (updatedTarget: TrainingTarget) => {
    try {
      const { error } = await supabase
        .from('training_targets')
        .update({
          target_camps: updatedTarget.targetCamps,
          target_citizens: updatedTarget.targetCitizens,
          actual_camps: updatedTarget.actualCamps,
          actual_citizens: updatedTarget.actualCitizens
        })
        .eq('id', updatedTarget.id);

      if (error) throw error;

      setTargets(prev => prev.map(target => 
        target.id === updatedTarget.id ? updatedTarget : target
      ));
    } catch (error: any) {
      console.error('Error updating target:', error);
    }
  };

  return {
    camps,
    targets,
    overallStats,
    loading,
    error,
    handleUpdateTarget,
    refetch: () => {
      fetchTrainingCamps();
      fetchTrainingTargets();
    }
  };
};
