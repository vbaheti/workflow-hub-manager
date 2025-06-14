
import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { usePermissions } from '../hooks/usePermissions';
import { useAgentData } from '../hooks/useAgentData';
import { RESOURCES } from '../types/rbac';
import { ProtectedComponent } from './ProtectedComponent';
import AddNewAgentForm from './AddNewAgentForm';
import ServiceAgentsTabs from './ServiceAgentsTabs';
import ServiceAgentsModals from './ServiceAgentsModals';

const ServiceAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignRoutesModalOpen, setAssignRoutesModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  
  const { selectedProject } = useProject();
  const { canAccess } = usePermissions();
  
  // Add fallback in case useAgentData hook fails
  let filteredAgents = [];
  let projectAgents = [];
  let searchTerm = '';
  let setSearchTerm = (term: string) => {};
  let currentProject = null;

  try {
    const agentData = useAgentData();
    filteredAgents = agentData.filteredAgents || [];
    projectAgents = agentData.projectAgents || [];
    searchTerm = agentData.searchTerm || '';
    setSearchTerm = agentData.setSearchTerm || ((term: string) => {});
    currentProject = agentData.currentProject || null;
  } catch (error) {
    console.error('Error loading agent data:', error);
  }

  const handleAgentAdded = (agent: any) => {
    console.log('Agent added:', agent);
  };

  const handleView = (agent: any) => {
    setSelectedAgent(agent);
    setViewModalOpen(true);
  };

  const handleEdit = (agent: any) => {
    setSelectedAgent(agent);
    setEditModalOpen(true);
  };

  const handleAssign = (agent: any) => {
    setSelectedAgent(agent);
    setAssignRoutesModalOpen(true);
  };

  const handlePerformance = (agent: any) => {
    setSelectedAgent(agent);
    setPerformanceModalOpen(true);
  };

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

  if (!canAccess(RESOURCES.AGENTS)) {
    return (
      <ProtectedComponent resource={RESOURCES.AGENTS} action="view">
        <div />
      </ProtectedComponent>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-5">
        <div>
          <h2 className="text-2xl font-bold">Service Agents - {currentProject.name}</h2>
          <p className="text-muted-foreground">{currentProject.description}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <ProtectedComponent resource={RESOURCES.AGENT_MANAGEMENT} action="create">
            <AddNewAgentForm onAgentAdded={handleAgentAdded} />
          </ProtectedComponent>
        </div>
      </div>

      <ServiceAgentsTabs
        filteredAgents={filteredAgents}
        projectAgents={projectAgents}
        selectedProject={selectedProject}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onView={handleView}
        onEdit={handleEdit}
        onAssign={handleAssign}
        onPerformance={handlePerformance}
      />

      <ServiceAgentsModals
        selectedAgent={selectedAgent}
        viewModalOpen={viewModalOpen}
        setViewModalOpen={setViewModalOpen}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        assignRoutesModalOpen={assignRoutesModalOpen}
        setAssignRoutesModalOpen={setAssignRoutesModalOpen}
        performanceModalOpen={performanceModalOpen}
        setPerformanceModalOpen={setPerformanceModalOpen}
      />
    </div>
  );
};

export default ServiceAgents;
