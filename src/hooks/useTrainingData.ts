
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrainingCamp {
  id: string;
  agent_id: number | null;
  camp_name: string;
  location: string | null;
  start_date: string;
  end_date: string;
  target_citizens: number | null;
  status: 'planned' | 'ongoing' | 'completed' | 'me_pending';
  created_at: string | null;
}

interface TrainingTarget {
  id: string;
  agent_id: number | null;
  target_camps: number | null;
  target_citizens: number | null;
  period: string;
  created_at: string | null;
}

interface TrainingStats {
  totalCamps: number;
  completedCamps: number;
  totalCitizensServed: number;
  avgCompletionRate: number;
  targetCamps: number;
  targetCitizens: number;
  campsAchievementRate: number;
  citizensAchievementRate: number;
}

export const useTrainingData = () => {
  const [camps, setCamps] = useState<TrainingCamp[]>([]);
  const [targets, setTargets] = useState<TrainingTarget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      
      const [campsResult, targetsResult] = await Promise.all([
        supabase.from('training_camps').select('*').order('start_date', { ascending: false }),
        supabase.from('training_targets').select('*').order('created_at', { ascending: false })
      ]);

      if (campsResult.error) throw campsResult.error;
      if (targetsResult.error) throw targetsResult.error;

      setCamps(campsResult.data || []);
      setTargets(targetsResult.data || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const handleUpdateTarget = async (targetId: string, updates: Partial<TrainingTarget>) => {
    try {
      const { error } = await supabase
        .from('training_targets')
        .update(updates)
        .eq('id', targetId);

      if (error) throw error;

      setTargets(prev => prev.map(target => 
        target.id === targetId ? { ...target, ...updates } : target
      ));
    } catch (error) {
      console.error('Error updating target:', error);
    }
  };

  const overallStats: TrainingStats = {
    totalCamps: camps.length,
    completedCamps: camps.filter(camp => camp.status === 'completed').length,
    totalCitizensServed: camps.reduce((sum, camp) => sum + (camp.target_citizens || 0), 0),
    avgCompletionRate: camps.length > 0 ? (camps.filter(camp => camp.status === 'completed').length / camps.length) * 100 : 0,
    targetCamps: targets.reduce((sum, target) => sum + (target.target_camps || 0), 0),
    targetCitizens: targets.reduce((sum, target) => sum + (target.target_citizens || 0), 0),
    campsAchievementRate: 0, // Will be calculated based on actual vs target
    citizensAchievementRate: 0 // Will be calculated based on actual vs target
  };

  return {
    camps,
    targets,
    overallStats,
    loading,
    handleUpdateTarget,
    refetch: fetchTrainingData
  };
};
