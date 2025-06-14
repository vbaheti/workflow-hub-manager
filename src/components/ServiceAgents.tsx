import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Route, BarChart3, Truck, DollarSign, Building2 } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useStateContext } from "../contexts/StateContext";
import { usePermissions } from '../hooks/usePermissions';
import { RESOURCES } from '../types/rbac';
import { ProtectedComponent } from './ProtectedComponent';
import AddNewAgentForm from './AddNewAgentForm';
import ViewAgentModal from './ViewAgentModal';
import EditAgentModal from "./EditAgentModal";
import AssignRoutesModal from "./AssignRoutesModal";
import ViewPerformanceModal from "./ViewPerformanceModal";
import ServiceAgentsManagement from './ServiceAgentsManagement';
import ServiceAgentsAssignment from './ServiceAgentsAssignment';
import ServiceAgentsTracking from './ServiceAgentsTracking';
import ServiceAgentsAnalytics from './ServiceAgentsAnalytics';
import ServicePriceSetting from './ServicePriceSetting';
import BankDetails from './BankDetails';

const ServiceAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignRoutesModalOpen, setAssignRoutesModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const { selectedProject, currentProject } = useProject();
  const { selectedStates } = useStateContext();
  const { canAccess, canCreate } = usePermissions();

  const allAgents = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      phone: "+91 98765 43210",
      location: "Delhi, India",
      status: "active",
      performance: "excellent",
      joinDate: "2023-01-15",
      totalCollections: "₹4,52,000",
      assignedRoutes: ["Central Delhi", "Connaught Place"],
      projects: ["Mumbai Financial Hub", "Delhi Service Network"],
      avatar: ""
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      phone: "+91 87654 32109",
      location: "Mumbai, India",
      status: "active",
      performance: "good",
      joinDate: "2023-03-20",
      totalCollections: "₹3,89,000",
      assignedRoutes: ["Bandra West", "Andheri East"],
      projects: ["Mumbai Financial Hub", "Bangalore Tech Corridor"],
      avatar: ""
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@company.com",
      phone: "+880 1712 345678",
      location: "Dhaka, Bangladesh",
      status: "inactive",
      performance: "average",
      joinDate: "2022-11-10",
      totalCollections: "৳2,95,000",
      assignedRoutes: ["Gulshan District"],
      projects: ["Dhaka Urban Services"],
      avatar: ""
    },
    {
      id: 4,
      name: "Fatima Al-Zahra",
      email: "fatima.alzahra@company.com",
      phone: "+971 50 123 4567",
      location: "Dubai, UAE",
      status: "active",
      performance: "excellent",
      joinDate: "2023-05-08",
      totalCollections: "AED 521,000",
      assignedRoutes: ["Business Bay", "DIFC"],
      projects: ["UAE Business Services", "Dubai Financial District"],
      avatar: ""
    },
    {
      id: 5,
      name: "Chen Wei Ming",
      email: "chen.weiming@company.com",
      phone: "+65 8765 4321",
      location: "Singapore",
      status: "active",
      performance: "good",
      joinDate: "2023-02-14",
      totalCollections: "S$418,000",
      assignedRoutes: ["Marina Bay", "Raffles Place"],
      projects: ["Singapore Financial Hub", "Southeast Asia Expansion"],
      avatar: ""
    },
    {
      id: 6,
      name: "Amara Okafor",
      email: "amara.okafor@company.com",
      phone: "+234 803 123 4567",
      location: "Lagos, Nigeria",
      status: "active",
      performance: "excellent",
      joinDate: "2023-04-12",
      totalCollections: "₦12,500,000",
      assignedRoutes: ["Victoria Island", "Ikoyi"],
      projects: ["Lagos Commercial Hub", "West Africa Network"],
      avatar: ""
    }
  ];

  // Helper: return the state name a project is "assigned to" (simulate for demo)
  function getProjectStates(projectName: string): string[] {
    // Simple mock mapping for demonstration.
    if (projectName.toLowerCase().includes("delhi")) return ["Delhi"];
    if (projectName.toLowerCase().includes("mumbai")) return ["Maharashtra"];
    if (projectName.toLowerCase().includes("bangalore") || projectName.toLowerCase().includes("karnataka")) return ["Karnataka"];
    if (projectName.toLowerCase().includes("dhaka")) return ["West Bengal"];
    if (projectName.toLowerCase().includes("dubai") || projectName.toLowerCase().includes("uae")) return ["Rajasthan"];
    return ["Delhi", "Maharashtra", "West Bengal"];
  }

  // Filter agents based on selected project and MULTIPLE states
  const projectAgents = allAgents.filter(agent => {
    if (!currentProject) return false;
    const agentInProject = agent.projects.includes(currentProject.name);
    // Simulated state: agent is considered in the state if assignedRoutes include locations for any selected state
    const routeMatch =
      selectedStates.length === 0
        ? true // no state filter
        : agent.assignedRoutes.some(
            (r: string) =>
              selectedStates.some((state) => r.toLowerCase().includes(state.toLowerCase()))
          );
    // As we lack state data for agents, fallback: show if project is mapped to any selected state
    const projectStates = getProjectStates(currentProject.name);
    const mappedState =
      selectedStates.length === 0
        ? true
        : selectedStates.some((s) => projectStates.includes(s));
    return agentInProject && (routeMatch || mappedState);
  });

  const filteredAgents = projectAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAgentAdded = (agent: any) => {
    // In a real application, this would update the agents list
    console.log('Agent added:', agent);
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

  // Check if user can access any agent features
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

      {/* MODALS */}
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
    </div>
  );
};

export default ServiceAgents;
