
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TrainingServicesDashboard from './training-services/TrainingServicesDashboard';
import TrainingCampForm from './training-services/TrainingCampForm';
import TrainingCampsTable from './training-services/TrainingCampsTable';
import { TrainingCamp, getOverallStats } from './training-services/TrainingServicesUtils';

interface TrainingServicesProps {
  agents: any[];
}

const TrainingServices = ({ agents }: TrainingServicesProps) => {
  const { toast } = useToast();
  
  const [camps, setCamps] = useState<TrainingCamp[]>([
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
      completedCitizens: 0,
      trainingType: 'awareness',
      status: 'ongoing'
    }
  ]);

  const [showNewCampForm, setShowNewCampForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = getOverallStats(camps);

  const handleCreateCamp = () => {
    toast({ title: "Training camp created successfully" });
    setShowNewCampForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Training Services Management</h3>
          <p className="text-sm text-muted-foreground">Manage training camps, track citizen participation, and monitor M&E completion</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowNewCampForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Training Camp
        </Button>
      </div>

      <TrainingServicesDashboard stats={stats} />

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

      <TrainingCampForm
        open={showNewCampForm}
        onOpenChange={setShowNewCampForm}
        agents={agents}
        onSubmit={handleCreateCamp}
      />
    </div>
  );
};

export default TrainingServices;
