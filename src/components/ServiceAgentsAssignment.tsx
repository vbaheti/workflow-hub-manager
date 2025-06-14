
import React from 'react';
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <RouteAssignment agents={agents} />
    </div>
    <div>
      <TimeBoundRouteAssignment agents={agents} projectId={projectId} />
    </div>
  </div>
);

export default ServiceAgentsAssignment;
