
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TrainingServicesDashboard from './training-services/TrainingServicesDashboard';
import TrainingCampsTable from './training-services/TrainingCampsTable';
import TrainingTargetSetting from './training-services/TrainingTargetSetting';
import TargetVsActualAnalysis from './training-services/TargetVsActualAnalysis';
import { useTrainingData } from '@/hooks/useTrainingData';

interface TrainingServicesProps {
  agents: any[];
}

const TrainingServices = ({ agents }: TrainingServicesProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { camps, targets, overallStats, handleUpdateTarget } = useTrainingData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Training Services Management</h3>
          <p className="text-sm text-muted-foreground">Set targets, track training camps, and monitor target vs actual performance</p>
        </div>
      </div>

      <TrainingServicesDashboard stats={overallStats} />

      <TargetVsActualAnalysis targets={targets} />

      <TrainingTargetSetting 
        targets={targets} 
        agents={agents} 
        onUpdateTarget={handleUpdateTarget} 
      />

      <div className="flex gap-4 items-center">
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Camps</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="me_pending">M&E Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TrainingCampsTable camps={camps} />
    </div>
  );
};

export default TrainingServices;
