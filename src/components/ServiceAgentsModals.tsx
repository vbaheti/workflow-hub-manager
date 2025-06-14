
import React from 'react';
import ViewAgentModal from './ViewAgentModal';
import EditAgentModal from './EditAgentModal';
import AssignRoutesModal from './AssignRoutesModal';
import ViewPerformanceModal from './ViewPerformanceModal';

interface ServiceAgentsModalsProps {
  selectedAgent: any;
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  assignRoutesModalOpen: boolean;
  setAssignRoutesModalOpen: (open: boolean) => void;
  performanceModalOpen: boolean;
  setPerformanceModalOpen: (open: boolean) => void;
}

const ServiceAgentsModals: React.FC<ServiceAgentsModalsProps> = ({
  selectedAgent,
  viewModalOpen,
  setViewModalOpen,
  editModalOpen,
  setEditModalOpen,
  assignRoutesModalOpen,
  setAssignRoutesModalOpen,
  performanceModalOpen,
  setPerformanceModalOpen
}) => {
  return (
    <>
      <ViewAgentModal
        agent={selectedAgent}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
      <EditAgentModal
        agent={selectedAgent}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <AssignRoutesModal
        agent={selectedAgent}
        open={assignRoutesModalOpen}
        onClose={() => setAssignRoutesModalOpen(false)}
      />
      <ViewPerformanceModal
        agent={selectedAgent}
        open={performanceModalOpen}
        onClose={() => setPerformanceModalOpen(false)}
      />
    </>
  );
};

export default ServiceAgentsModals;
