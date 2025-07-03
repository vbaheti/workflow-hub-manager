
import React from 'react';
import TrainingServices from '@/components/TrainingServices';
import { useAgents } from '@/hooks/useAgents';

const TrainingPage = () => {
  const { agents } = useAgents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Training Programs</h1>
          <p className="text-muted-foreground">Manage training camps, set targets, and track progress</p>
        </div>
      </div>

      <TrainingServices agents={agents} />
    </div>
  );
};

export default TrainingPage;
