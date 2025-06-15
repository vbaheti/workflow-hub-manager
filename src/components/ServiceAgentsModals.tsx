
import React from 'react';
import ViewAgentModal from './ViewAgentModal';
import EditAgentModal from './EditAgentModal';
import AssignRoutesModal from './AssignRoutesModal';
import ViewPerformanceModal from './ViewPerformanceModal';
import PermissionGate from './PermissionGate';

interface ServiceAgentsModalsProps {
  selectedAgent: any;
  viewModalOpen: boolean;
  editModalOpen: boolean;
  assignRoutesModalOpen: boolean;
  performanceModalOpen: boolean;
  onCloseViewModal: () => void;
  onCloseEditModal: () => void;
  onCloseAssignRoutesModal: () => void;
  onClosePerformanceModal: () => void;
}

const ServiceAgentsModals: React.FC<ServiceAgentsModalsProps> = ({
  selectedAgent,
  viewModalOpen,
  editModalOpen,
  assignRoutesModalOpen,
  performanceModalOpen,
  onCloseViewModal,
  onCloseEditModal,
  onCloseAssignRoutesModal,
  onClosePerformanceModal
}) => {
  return (
    <>
      <PermissionGate permissions={['view_agents']}>
        <ViewAgentModal
          agent={selectedAgent}
          open={viewModalOpen}
          onClose={onCloseViewModal}
        />
      </PermissionGate>
      
      <PermissionGate permissions={['edit_agents']}>
        <EditAgentModal
          agent={selectedAgent}
          open={editModalOpen}
          onClose={onCloseEditModal}
        />
      </PermissionGate>
      
      <PermissionGate permissions={['assign_routes']}>
        <AssignRoutesModal
          agent={selectedAgent}
          open={assignRoutesModalOpen}
          onClose={onCloseAssignRoutesModal}
        />
      </PermissionGate>
      
      <PermissionGate permissions={['view_analytics']}>
        <ViewPerformanceModal
          agent={selectedAgent}
          open={performanceModalOpen}
          onClose={onClosePerformanceModal}
        />
      </PermissionGate>
    </>
  );
};

export default ServiceAgentsModals;
