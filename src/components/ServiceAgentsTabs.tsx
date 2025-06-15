
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Route, BarChart3, Truck } from 'lucide-react';
import { useRBAC } from '../contexts/RBACContext';
import ServiceAgentsManagement from './ServiceAgentsManagement';
import ServiceAgentsAssignment from './ServiceAgentsAssignment';
import ServiceAgentsTracking from './ServiceAgentsTracking';
import ServiceAgentsAnalytics from './ServiceAgentsAnalytics';

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
  const { hasPermission } = useRBAC();

  return (
    <Tabs defaultValue="agents" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="agents" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Agents
        </TabsTrigger>
        {hasPermission('assign_routes') && (
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Assignment & Training
          </TabsTrigger>
        )}
        {hasPermission('track_services') && (
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Service Tracking
          </TabsTrigger>
        )}
        {hasPermission('view_analytics') && (
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        )}
      </TabsList>

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

      {hasPermission('assign_routes') && (
        <TabsContent value="assignment">
          <ServiceAgentsAssignment
            agents={projectAgents}
            projectId={selectedProject}
          />
        </TabsContent>
      )}

      {hasPermission('track_services') && (
        <TabsContent value="delivery">
          <ServiceAgentsTracking />
        </TabsContent>
      )}

      {hasPermission('view_analytics') && (
        <TabsContent value="analytics">
          <ServiceAgentsAnalytics
            agents={projectAgents}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ServiceAgentsTabs;
