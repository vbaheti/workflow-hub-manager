
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Route, BarChart3, Truck, DollarSign, Building2 } from 'lucide-react';
import { ProtectedComponent } from './ProtectedComponent';
import { RESOURCES } from '../types/rbac';
import ServiceAgentsManagement from './ServiceAgentsManagement';
import ServiceAgentsAssignment from './ServiceAgentsAssignment';
import ServiceAgentsTracking from './ServiceAgentsTracking';
import ServiceAgentsAnalytics from './ServiceAgentsAnalytics';
import ServicePriceSetting from './ServicePriceSetting';
import BankDetails from './BankDetails';

interface ServiceAgentsTabsProps {
  filteredAgents: any[];
  projectAgents: any[];
  selectedProject: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onView: (agent: any) => void;
  onEdit: (agent: any) => void;
  onAssign: (agent: any) => void;
  onPerformance: (agent: any) => void;
}

const ServiceAgentsTabs: React.FC<ServiceAgentsTabsProps> = ({
  filteredAgents,
  projectAgents,
  selectedProject,
  searchTerm,
  setSearchTerm,
  onView,
  onEdit,
  onAssign,
  onPerformance
}) => {
  return (
    <Tabs defaultValue="agents" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <ProtectedComponent resource={RESOURCES.AGENT_MANAGEMENT} action="view">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
        </ProtectedComponent>
        
        <ProtectedComponent resource={RESOURCES.AGENT_ASSIGNMENT} action="view">
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Assignment & Scheduling
          </TabsTrigger>
        </ProtectedComponent>
        
        <ProtectedComponent resource={RESOURCES.AGENT_TRACKING} action="view">
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Service Tracking
          </TabsTrigger>
        </ProtectedComponent>
        
        <ProtectedComponent resource={RESOURCES.AGENT_ANALYTICS} action="view">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </ProtectedComponent>
        
        <ProtectedComponent resource={RESOURCES.SERVICE_PRICING} action="view">
          <TabsTrigger value="service-pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Service Pricing
          </TabsTrigger>
        </ProtectedComponent>
        
        <ProtectedComponent resource={RESOURCES.BANK_DETAILS} action="view">
          <TabsTrigger value="bank-details" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Bank Details
          </TabsTrigger>
        </ProtectedComponent>
      </TabsList>

      <ProtectedComponent resource={RESOURCES.AGENT_MANAGEMENT} action="view">
        <TabsContent value="agents">
          <ServiceAgentsManagement
            agents={filteredAgents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onView={onView}
            onEdit={onEdit}
            onAssign={onAssign}
            onPerformance={onPerformance}
          />
        </TabsContent>
      </ProtectedComponent>

      <ProtectedComponent resource={RESOURCES.AGENT_ASSIGNMENT} action="view">
        <TabsContent value="assignment">
          <ServiceAgentsAssignment
            agents={projectAgents}
            projectId={selectedProject}
          />
        </TabsContent>
      </ProtectedComponent>

      <ProtectedComponent resource={RESOURCES.AGENT_TRACKING} action="view">
        <TabsContent value="delivery">
          <ServiceAgentsTracking />
        </TabsContent>
      </ProtectedComponent>

      <ProtectedComponent resource={RESOURCES.AGENT_ANALYTICS} action="view">
        <TabsContent value="analytics">
          <ServiceAgentsAnalytics
            agents={projectAgents}
          />
        </TabsContent>
      </ProtectedComponent>

      <ProtectedComponent resource={RESOURCES.SERVICE_PRICING} action="view">
        <TabsContent value="service-pricing">
          <ServicePriceSetting />
        </TabsContent>
      </ProtectedComponent>

      <ProtectedComponent resource={RESOURCES.BANK_DETAILS} action="view">
        <TabsContent value="bank-details">
          <BankDetails />
        </TabsContent>
      </ProtectedComponent>
    </Tabs>
  );
};

export default ServiceAgentsTabs;
