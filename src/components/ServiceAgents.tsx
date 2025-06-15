
import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import PermissionGate from './PermissionGate';
import useAgentData from '../hooks/useAgentData';
import ServiceAgentsHeader from './ServiceAgentsHeader';
import ServiceAgentsTabs from './ServiceAgentsTabs';
import ServiceAgentsModals from './ServiceAgentsModals';

const ServiceAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignRoutesModalOpen, setAssignRoutesModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  
  const { selectedProject, currentProject } = useProject();
  const { projectAgents, getFilteredAgents } = useAgentData();
  
  const filteredAgents = getFilteredAgents(searchTerm);

  const handleAgentAdded = (agent: any) => {
    console.log('Agent added:', agent);
  };

  if (!currentProject) {
    return <ServiceAgentsHeader onAgentAdded={handleAgentAdded} />;
  }

  return (
    <PermissionGate permissions={['view_agents']}>
      <div className="space-y-6">
        <ServiceAgentsHeader onAgentAdded={handleAgentAdded} />

        <ServiceAgentsTabs
          filteredAgents={filteredAgents}
          projectAgents={projectAgents}
          selectedProject={selectedProject}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onView={agent => {
            setSelectedAgent(agent);
            setViewModalOpen(true);
          }}
          onEdit={agent => {
            setSelectedAgent(agent);
            setEditModalOpen(true);
          }}
          onAssign={agent => {
            setSelectedAgent(agent);
            setAssignRoutesModalOpen(true);
          }}
          onPerformance={agent => {
            setSelectedAgent(agent);
            setPerformanceModalOpen(true);
          }}
        />

        <ServiceAgentsModals
          selectedAgent={selectedAgent}
          viewModalOpen={viewModalOpen}
          editModalOpen={editModalOpen}
          assignRoutesModalOpen={assignRoutesModalOpen}
          performanceModalOpen={performanceModalOpen}
          onCloseViewModal={() => setViewModalOpen(false)}
          onCloseEditModal={() => setEditModalOpen(false)}
          onCloseAssignRoutesModal={() => setAssignRoutesModalOpen(false)}
          onClosePerformanceModal={() => setPerformanceModalOpen(false)}
        />
      </div>
    </PermissionGate>
  );
};

export default ServiceAgents;
