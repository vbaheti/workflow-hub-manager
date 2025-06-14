
import React from 'react';
import RouteAssignment from './RouteAssignment';
import TimeBoundRouteAssignment from './TimeBoundRouteAssignment';
import { Agent, RouteAssignment as RouteAssignmentType } from '@/types';

interface ServiceAgentsAssignmentProps {
  agents: Agent[];
  projectId: string;
  assignments: RouteAssignmentType[];
  handleCreateAssignment: (assignment: Omit<RouteAssignmentType, 'id'>) => boolean;
}

const ServiceAgentsAssignment: React.FC<ServiceAgentsAssignmentProps> = ({
  agents,
  projectId,
  assignments,
  handleCreateAssignment,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <RouteAssignment agents={agents} />
    </div>
    <div>
      <TimeBoundRouteAssignment 
        agents={agents} 
        projectId={projectId} 
        assignments={assignments}
        setAssignments={() => {}} // This is now handled by handleCreateAssignment
      />
    </div>
  </div>
);

export default ServiceAgentsAssignment;
