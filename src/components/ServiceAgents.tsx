import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Mail, Phone, MapPin, MoreHorizontal, Route, BarChart3, TrendingUp, Users, Calendar, Truck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import RouteAssignment from './RouteAssignment';
import AgentAnalytics from './AgentAnalytics';
import TimeBoundRouteAssignment from './TimeBoundRouteAssignment';
import AddNewAgentForm from './AddNewAgentForm';
import ServiceDeliveryTracking from './ServiceDeliveryTracking';
import { useProject } from '../contexts/ProjectContext';
import ViewAgentModal from "./ViewAgentModal";
import EditAgentModal from "./EditAgentModal";
import AssignRoutesModal from "./AssignRoutesModal";
import ViewPerformanceModal from "./ViewPerformanceModal";

const ServiceAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignRoutesModalOpen, setAssignRoutesModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const { selectedProject, currentProject } = useProject();

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

  // Filter agents based on selected project
  const projectAgents = allAgents.filter(agent => {
    if (!currentProject) return false;
    return agent.projects.includes(currentProject.name);
  });

  const filteredAgents = projectAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <Badge className="bg-green-100 text-green-800">Active</Badge> :
      <Badge variant="secondary">Inactive</Badge>;
  };

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: <Badge className="bg-blue-100 text-blue-800">Excellent</Badge>,
      good: <Badge className="bg-green-100 text-green-800">Good</Badge>,
      average: <Badge variant="secondary">Average</Badge>
    };
    return variants[performance as keyof typeof variants];
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Agents - {currentProject.name}</h2>
          <p className="text-muted-foreground">{currentProject.description}</p>
        </div>
        <AddNewAgentForm onAgentAdded={handleAgentAdded} />
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Route Assignment
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Routes
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Service Tracking
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>
                Overview of agents in {currentProject.name}
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Routes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Collections</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={agent.avatar} />
                            <AvatarFallback>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {agent.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{agent.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{agent.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{agent.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agent.projects.filter(project => project === currentProject.name).map((project, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agent.assignedRoutes.map((route, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {route}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(agent.status)}</TableCell>
                      <TableCell>{getPerformanceBadge(agent.performance)}</TableCell>
                      <TableCell className="font-semibold">{agent.totalCollections}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent);
                                setViewModalOpen(true);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent);
                                setEditModalOpen(true);
                              }}
                            >
                              Edit Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent);
                                setAssignRoutesModalOpen(true);
                              }}
                            >
                              Assign Routes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAgent(agent);
                                setPerformanceModalOpen(true);
                              }}
                            >
                              View Performance
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <RouteAssignment agents={projectAgents} />
        </TabsContent>

        <TabsContent value="schedule">
          <TimeBoundRouteAssignment agents={projectAgents} projectId={selectedProject} />
        </TabsContent>

        <TabsContent value="delivery">
          <ServiceDeliveryTracking />
        </TabsContent>

        <TabsContent value="analytics">
          <AgentAnalytics agents={projectAgents} />
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
