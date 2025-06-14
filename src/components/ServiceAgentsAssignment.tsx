
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MapPin, Calendar } from 'lucide-react';
import AgentProjectAssignment from './AgentProjectAssignment';
import RouteAssignment from './RouteAssignment';
import TimeBoundRouteAssignment from './TimeBoundRouteAssignment';

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
        Manage agent assignments, route planning, and scheduling with conflict detection
      </p>
    </div>
    
    <Tabs defaultValue="project-assignment" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="project-assignment" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Project Assignment
        </TabsTrigger>
        <TabsTrigger value="route-management" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Route Management
        </TabsTrigger>
        <TabsTrigger value="scheduling" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Time-bound Scheduling
        </TabsTrigger>
      </TabsList>

      <TabsContent value="project-assignment">
        <AgentProjectAssignment agents={agents} />
      </TabsContent>

      <TabsContent value="route-management">
        <RouteAssignment agents={agents} />
      </TabsContent>

      <TabsContent value="scheduling">
        <TimeBoundRouteAssignment agents={agents} projectId={projectId} />
      </TabsContent>
    </Tabs>
  </div>
);

export default ServiceAgentsAssignment;
