
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
      setError(null);

      // Use raw SQL query since the table isn't in the generated types yet
      let query = supabase.rpc('exec_sql', {
        sql: projectId 
          ? `SELECT * FROM targets WHERE project_id = '${projectId}' ORDER BY created_at DESC`
          : 'SELECT * FROM targets ORDER BY created_at DESC'
      });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching targets:', fetchError);
        setError(fetchError.message);
        return;
      }

      // Since we can't use the generated types, we'll work with the raw data
      setTargets(data || []);
    } catch (err) {
      console.error('Error in fetchTargets:', err);
      setError('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
  };

  const createTarget = async (targetData: CreateTargetData) => {
    try {
      // Use raw SQL for insert since the table isn't in generated types
      const { data, error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO targets (
            name, project_id, metric_type, target_value, current_progress,
            assigned_to_id, parent_target_id, period_start, period_end, status
          ) VALUES (
            '${targetData.name}',
            '${targetData.project_id}',
            '${targetData.metric_type}',
            ${targetData.target_value},
            ${targetData.current_progress},
            '${targetData.assigned_to_id}',
            ${targetData.parent_target_id ? `'${targetData.parent_target_id}'` : 'NULL'},
            '${targetData.period_start}',
            '${targetData.period_end}',
            '${targetData.status}'
          ) RETURNING *;
        `
      });

      if (createError) {
        console.error('Error creating target:', createError);
        return { data: null, error: createError };
      }

      // Refresh the targets list
      await fetchTargets();
      
      return { data: data?.[0] || null, error: null };
    } catch (err) {
      console.error('Error in createTarget:', err);
      return { data: null, error: err };
    }
  };

  const updateTarget = async (targetId: string, updates: Partial<CreateTargetData>) => {
    try {
      // Build UPDATE query dynamically
      const updateFields = Object.entries(updates)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key} = '${value}'`;
          } else if (typeof value === 'number') {
            return `${key} = ${value}`;
          } else if (value === null) {
            return `${key} = NULL`;
          }
          return '';
        })
        .filter(Boolean)
        .join(', ');

      if (!updateFields) {
        return { data: null, error: new Error('No valid updates provided') };
      }

      const { data, error: updateError } = await supabase.rpc('exec_sql', {
        sql: `
          UPDATE targets 
          SET ${updateFields}, updated_at = NOW()
          WHERE id = '${targetId}'
          RETURNING *;
        `
      });

      if (updateError) {
        console.error('Error updating target:', updateError);
        return { data: null, error: updateError };
      }

      // Update local state
      setTargets(prev => prev.map(target => 
        target.id === targetId ? { ...target, ...updates } : target
      ));

      return { data: data?.[0] || null, error: null };
    } catch (err) {
      console.error('Error in updateTarget:', err);
      return { data: null, error: err };
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
    refetch: fetchTargets
  };
};
