
import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import AddNewAgentForm from './AddNewAgentForm';
import PermissionGate from './PermissionGate';

interface ServiceAgentsHeaderProps {
  onAgentAdded: (agent: any) => void;
}

const ServiceAgentsHeader: React.FC<ServiceAgentsHeaderProps> = ({ onAgentAdded }) => {
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Please select a project from the sidebar to view agents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-5">
      <div>
        <h2 className="text-2xl font-bold">Service Agents - {currentProject.name}</h2>
        <p className="text-muted-foreground">{currentProject.description}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <PermissionGate permissions={['onboard_agents']}>
          <AddNewAgentForm onAgentAdded={onAgentAdded} />
        </PermissionGate>
      </div>
    </div>
  );
};

export default ServiceAgentsHeader;
