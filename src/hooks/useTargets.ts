
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Target {
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

export interface CreateTargetData {
  name: string;
  project_id: string;
  metric_type: 'revenue' | 'services_completed' | 'fee_collection' | 'training_camps' | 'citizens_trained';
  target_value: number;
  current_progress: number;
  assigned_to_id: string;
  parent_target_id: string | null;
  period_start: string;
  period_end: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
}

export const useTargets = (projectId?: string) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('targets' as any)
        .select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching targets:', error);
        setError(error.message);
        setTargets([]);
      } else {
        setTargets(data || []);
      }
    } catch (err) {
      console.error('Error in fetchTargets:', err);
      setError('Failed to fetch targets');
      setTargets([]);
    } finally {
      setLoading(false);
    }
  };

  const createTarget = async (targetData: CreateTargetData) => {
    try {
      const { data, error } = await supabase
        .from('targets' as any)
        .insert([targetData])
        .select()
        .single();

      if (error) {
        console.error('Error creating target:', error);
        return { data: null, error };
      }

      setTargets(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      console.error('Error in createTarget:', err);
      return { data: null, error: err };
    }
  };

  const updateTarget = async (id: string, updates: Partial<Target>) => {
    try {
      const { data, error } = await supabase
        .from('targets' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating target:', error);
        return { data: null, error };
      }

      setTargets(prev => prev.map(target => 
        target.id === id ? { ...target, ...data } : target
      ));
      return { data, error: null };
    } catch (err) {
      console.error('Error in updateTarget:', err);
      return { data: null, error: err };
    }
  };

  const deleteTarget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('targets' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting target:', error);
        return { error };
      }

      setTargets(prev => prev.filter(target => target.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error in deleteTarget:', err);
      return { error: err };
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [projectId]);

  return {
    targets,
    loading,
    error,
    createTarget,
    updateTarget,
    deleteTarget,
    refetch: fetchTargets
  };
};
