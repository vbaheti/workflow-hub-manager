
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  state: string | null;
  district: string | null;
  area: string | null;
  status: string;
  performance_score: number;
  total_collections: number;
  services_completed: number;
  assigned_routes: string[];
  created_at: string;
  updated_at: string;
}

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('name');

      if (error) throw error;

      setAgents(data || []);
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const addAgent = async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert([agentData])
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => [...prev, data]);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding agent:', error);
      return { data: null, error: error.message };
    }
  };

  const updateAgent = async (id: number, updates: Partial<Agent>) => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => prev.map(agent => 
        agent.id === id ? { ...agent, ...data } : agent
      ));
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating agent:', error);
      return { data: null, error: error.message };
    }
  };

  return {
    agents,
    loading,
    error,
    fetchAgents,
    addAgent,
    updateAgent
  };
};
