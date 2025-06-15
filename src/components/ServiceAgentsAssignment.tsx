
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, MapPin, GraduationCap } from 'lucide-react';
import ServiceAssignment from './ServiceAssignment';
import RouteAssignment from './RouteAssignment';
import TrainingServices from './TrainingServices';

interface ServiceAgentsAssignmentProps {
  agents: any[];
  projectId: string;
}

const ServiceAgentsAssignment: React.FC<ServiceAgentsAssignmentProps> = ({
  agents,
  projectId
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Assignment & Scheduling Management</h3>
      <p className="text-sm text-muted-foreground">
        Assign services with targets, manage routes with scheduling, and organize training programs
      </p>
    </div>
    
    <Tabs defaultValue="service-assignment" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="service-assignment" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Service Assignment
        </TabsTrigger>
        <TabsTrigger value="route-management" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Route Management & Scheduling
        </TabsTrigger>
        <TabsTrigger value="training-services" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Training Services
        </TabsTrigger>
      </TabsList>

      <TabsContent value="service-assignment">
        <ServiceAssignment agents={agents} />
      </TabsContent>

      <TabsContent value="route-management">
        <RouteAssignment agents={agents} />
      </TabsContent>

      <TabsContent value="training-services">
        <TrainingServices agents={agents} />
      </TabsContent>
    </Tabs>
  </div>
);

export default ServiceAgentsAssignment;
