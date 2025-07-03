
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Target {
  id: string;
  name: string;
  project_id: string | null;
  metric_type: 'revenue' | 'services_completed' | 'fee_collection' | 'training_camps' | 'citizens_trained';
  target_value: number;
  current_progress: number;
  assigned_to_id: string;
  parent_target_id: string | null;
  period_start: string;
  period_end: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useTargets = (projectId?: string) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('targets')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTargets(data || []);
    } catch (error: any) {
      console.error('Error fetching targets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTarget = async (targetData: Omit<Target, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('targets')
        .insert([targetData])
        .select()
        .single();

      if (error) throw error;

      setTargets(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating target:', error);
      return { data: null, error: error.message };
    }
  };

  const updateTarget = async (id: string, updates: Partial<Target>) => {
    try {
      const { data, error } = await supabase
        .from('targets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTargets(prev => prev.map(target => 
        target.id === id ? { ...target, ...data } : target
      ));
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating target:', error);
      return { data: null, error: error.message };
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [projectId]);

  return {
    targets,
    loading,
    error,
    fetchTargets,
    createTarget,
    updateTarget
  };
};
