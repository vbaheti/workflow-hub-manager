
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, MapPin } from 'lucide-react';
import ServiceAssignment from './ServiceAssignment';
import RouteAssignment from './RouteAssignment';

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
        Assign services with targets and manage routes with scheduling and location hierarchy
      </p>
    </div>
    
    <Tabs defaultValue="service-assignment" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="service-assignment" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Service Assignment
        </TabsTrigger>
        <TabsTrigger value="route-management" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Route Management & Scheduling
        </TabsTrigger>
      </TabsList>

      <TabsContent value="service-assignment">
        <ServiceAssignment agents={agents} />
      </TabsContent>

      <TabsContent value="route-management">
        <RouteAssignment agents={agents} />
      </TabsContent>
    </Tabs>
  </div>
);

export default ServiceAgentsAssignment;
