
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, DollarSign, MapPin } from 'lucide-react';
import { useRBAC } from '../contexts/RBACContext';
import { useProject } from '../contexts/ProjectContext';
import ApprovalTrigger from './ApprovalTrigger';
import ServiceAgents from './ServiceAgents';

export default function ServiceAgentsWithApprovals() {
  const { hasPermission } = useRBAC();
  const { currentProject } = useProject();

  // Example of wrapping sensitive actions with approval triggers
  const handleAgentOnboarding = (agentData: any) => {
    return (
      <ApprovalTrigger
        type="agent_onboarding"
        title={`New Agent Onboarding - ${agentData.name}`}
        description={`Request to onboard new agent ${agentData.name} for ${currentProject?.name}`}
        metadata={{
          agentName: agentData.name,
          agentEmail: agentData.email,
          projectId: currentProject?.id,
          role: agentData.role
        }}
        requiredPermissions={['onboard_agents']}
        priority="high"
        projectId={currentProject?.id}
      >
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Agent (Requires Approval)
        </Button>
      </ApprovalTrigger>
    );
  };

  const handlePricingChange = (pricingData: any) => {
    return (
      <ApprovalTrigger
        type="pricing_change"
        title={`Pricing Update - ${pricingData.serviceName}`}
        description={`Request to update pricing for ${pricingData.serviceName} from $${pricingData.oldPrice} to $${pricingData.newPrice}`}
        metadata={pricingData}
        requiredPermissions={['manage_pricing']}
        priority="medium"
        projectId={currentProject?.id}
      >
        <Button variant="outline" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Update Pricing (Requires Approval)
        </Button>
      </ApprovalTrigger>
    );
  };

  const handleRouteAssignment = (assignmentData: any) => {
    return (
      <ApprovalTrigger
        type="route_assignment"
        title={`Route Assignment - ${assignmentData.agentName}`}
        description={`Request to assign new routes to ${assignmentData.agentName}`}
        metadata={assignmentData}
        requiredPermissions={['assign_routes']}
        priority="low"
        projectId={currentProject?.id}
      >
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Assign Routes (Requires Approval)
        </Button>
      </ApprovalTrigger>
    );
  };

  return (
    <div className="space-y-6">
      {/* Example approval triggers for sensitive actions */}
      {hasPermission('onboard_agents') && (
        <div className="flex gap-2">
          {handleAgentOnboarding({ name: 'New Agent', email: 'agent@example.com', role: 'agent' })}
        </div>
      )}
      
      {/* Original ServiceAgents component */}
      <ServiceAgents />
    </div>
  );
}
