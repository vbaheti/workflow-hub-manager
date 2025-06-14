import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Route, BarChart3, Truck, DollarSign, Building2 } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
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
import { useStateContext } from "../contexts/StateContext";
import { Agent, RouteAssignment } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const ServiceAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignRoutesModalOpen, setAssignRoutesModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const { selectedProject, currentProject } = useProject();
  const { selectedStates } = useStateContext();
  const { toast } = useToast();

  const allAgents: Agent[] = [
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
  
  const [assignments, setAssignments] = useState<RouteAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'John Smith',
      routeName: 'Manhattan District A',
      visitDate: new Date('2024-06-15'),
      startTime: '09:00',
      endTime: '17:00',
      status: 'scheduled',
      coordinates: [
        { lat: 40.7580, lng: -73.9855, address: '350 5th Ave, New York, NY 10118' },
        { lat: 40.7614, lng: -73.9776, address: '11 W 42nd St, New York, NY 10036' },
        { lat: 40.7505, lng: -73.9934, address: '1 Wall St, New York, NY 10005' }
      ],
      notes: 'Focus on high-priority clients',
      plannedStops: 3,
      actualStops: 3,
      efficiency: 95
    },
    {
      id: '2',
      agentId: 2,
      agentName: 'Sarah Johnson',
      routeName: 'Hollywood District B',
      visitDate: new Date('2024-06-16'),
      startTime: '08:30',
      endTime: '16:30',
      status: 'completed',
      coordinates: [
        { lat: 34.0928, lng: -118.3287, address: '6801 Hollywood Blvd, Los Angeles, CA 90028' },
        { lat: 34.1016, lng: -118.3416, address: '1750 N Highland Ave, Los Angeles, CA 90028' }
      ],
      notes: 'Client meetings scheduled',
      plannedStops: 2,
      actualStops: 2,
      efficiency: 100
    }
  ]);

  const handleCreateAssignment = (newAssignment: Omit<RouteAssignment, 'id'>) => {
    const agentAssignments = assignments.filter(a => a.agentId === newAssignment.agentId && a.status !== 'cancelled');
    
    const newStartStr = `${format(newAssignment.visitDate, 'yyyy-MM-dd')}T${newAssignment.startTime}:00`;
    const newEndStr = `${format(newAssignment.visitDate, 'yyyy-MM-dd')}T${newAssignment.endTime}:00`;
    const newStartTime = new Date(newStartStr);
    const newEndTime = new Date(newEndStr);

    if (newStartTime >= newEndTime) {
      toast({
        title: "Invalid Time Range",
        description: "Start time must be before end time.",
        variant: "destructive",
      });
      return false;
    }

    const conflict = agentAssignments.find(existing => {
        if (format(existing.visitDate, 'yyyy-MM-dd') !== format(newAssignment.visitDate, 'yyyy-MM-dd')) {
            return false;
        }
        
        const existingStartTime = new Date(`${format(existing.visitDate, 'yyyy-MM-dd')}T${existing.startTime}:00`);
        const existingEndTime = new Date(`${format(existing.visitDate, 'yyyy-MM-dd')}T${existing.endTime}:00`);
        
        return newStartTime < existingEndTime && newEndTime > existingStartTime;
    });
    
    if (conflict) {
        toast({
            title: "Assignment Conflict",
            description: `This assignment for ${newAssignment.routeName} conflicts with an existing route: ${conflict.routeName} (${conflict.startTime} - ${conflict.endTime}).`,
            variant: "destructive",
        });
        return false;
    } else {
        const assignmentWithId = { ...newAssignment, id: new Date().toISOString() };
        setAssignments(prev => [...prev, assignmentWithId]);
        toast({
            title: "Assignment Created",
            description: `Successfully assigned ${newAssignment.routeName} to ${newAssignment.agentName}.`,
        });
        return true;
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-5">
        <div>
          <h2 className="text-2xl font-bold">Service Agents - {currentProject.name}</h2>
          <p className="text-muted-foreground">{currentProject.description}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <AddNewAgentForm onAgentAdded={handleAgentAdded} />
        </div>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Assignment & Scheduling
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Service Tracking
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="service-pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Service Pricing
          </TabsTrigger>
          <TabsTrigger value="bank-details" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Bank Details
          </TabsTrigger>
        </TabsList>

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
            onAssign={(agent: Agent) => {
              setSelectedAgent(agent);
              setAssignRoutesModalOpen(true);
            }}
            onPerformance={(agent: Agent) => {
              setSelectedAgent(agent);
              setPerformanceModalOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="assignment">
          <ServiceAgentsAssignment
            agents={projectAgents}
            projectId={selectedProject}
            assignments={assignments}
            handleCreateAssignment={handleCreateAssignment}
          />
        </TabsContent>

        <TabsContent value="delivery">
          <ServiceAgentsTracking />
        </TabsContent>

        <TabsContent value="analytics">
          <ServiceAgentsAnalytics
            agents={projectAgents}
          />
        </TabsContent>

        <TabsContent value="service-pricing">
          <ServicePriceSetting />
        </TabsContent>

        <TabsContent value="bank-details">
          <BankDetails />
        </TabsContent>
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
        assignments={assignments}
        handleCreateAssignment={handleCreateAssignment}
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
