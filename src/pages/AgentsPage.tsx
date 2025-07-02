
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Route, BarChart3, Truck, Search, Plus, Eye, Edit, MapPin, TrendingUp } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useRBAC } from '../contexts/RBACContext';
import PermissionGate from '../components/PermissionGate';
import useAgentData from '../hooks/useAgentData';

// Agent modals components
const ViewAgentModal = ({ agent, open, onClose }: { agent: any; open: boolean; onClose: () => void }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Agent Details</DialogTitle>
        <DialogDescription>Complete information about the selected agent</DialogDescription>
      </DialogHeader>
      {agent && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Personal Information</h3>
              <p><strong>Name:</strong> {agent.name}</p>
              <p><strong>Email:</strong> {agent.email}</p>
              <p><strong>Phone:</strong> {agent.phone}</p>
              <p><strong>Status:</strong> <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>{agent.status}</Badge></p>
            </div>
            <div>
              <h3 className="font-semibold">Location Details</h3>
              <p><strong>State:</strong> {agent.state}</p>
              <p><strong>District:</strong> {agent.district}</p>
              <p><strong>Area:</strong> {agent.area}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{agent.performance_score}</p>
              <p className="text-sm text-muted-foreground">Performance Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">₹{agent.total_collections?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Collections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{agent.services_completed}</p>
              <p className="text-sm text-muted-foreground">Services Completed</p>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

const EditAgentModal = ({ agent, open, onClose }: { agent: any; open: boolean; onClose: () => void }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Agent</DialogTitle>
        <DialogDescription>Update agent information</DialogDescription>
      </DialogHeader>
      {agent && (
        <div className="space-y-4">
          <Input defaultValue={agent.name} placeholder="Agent Name" />
          <Input defaultValue={agent.email} placeholder="Email" />
          <Input defaultValue={agent.phone} placeholder="Phone" />
          <Select defaultValue={agent.status}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save Changes</Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

const AssignRoutesModal = ({ agent, open, onClose }: { agent: any; open: boolean; onClose: () => void }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Assign Routes</DialogTitle>
        <DialogDescription>Assign service routes to {agent?.name}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Route" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="route1">Route 1 - Central Mumbai</SelectItem>
            <SelectItem value="route2">Route 2 - South Mumbai</SelectItem>
            <SelectItem value="route3">Route 3 - North Mumbai</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Assign Route</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const ViewPerformanceModal = ({ agent, open, onClose }: { agent: any; open: boolean; onClose: () => void }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Performance Analytics</DialogTitle>
        <DialogDescription>Detailed performance metrics for {agent?.name}</DialogDescription>
      </DialogHeader>
      {agent && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{agent.performance_score}</div>
                <p className="text-sm text-muted-foreground">Performance Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">₹{agent.total_collections?.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Collections</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{agent.services_completed}</div>
                <p className="text-sm text-muted-foreground">Services Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

const AddNewAgentForm = ({ onAgentAdded }: { onAgentAdded: (agent: any) => void }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>Create a new agent profile</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Agent Name" />
          <Input placeholder="Email" />
          <Input placeholder="Phone" />
          <Input placeholder="Location" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="karnataka">Karnataka</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { onAgentAdded({}); setOpen(false); }}>Add Agent</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Agents Management Component
const AgentsManagement = ({ 
  agents, 
  searchTerm, 
  setSearchTerm, 
  onView, 
  onEdit, 
  onAssign, 
  onPerformance 
}: {
  agents: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onView: (agent: any) => void;
  onEdit: (agent: any) => void;
  onAssign: (agent: any) => void;
  onPerformance: (agent: any) => void;
}) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Agents List</CardTitle>
        <CardDescription>Manage your service agents</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.state}, {agent.district}</TableCell>
                <TableCell>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </TableCell>
                <TableCell>{agent.performance_score}/5.0</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onView(agent)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <PermissionGate permissions={['edit_agents']}>
                      <Button variant="outline" size="sm" onClick={() => onEdit(agent)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate permissions={['assign_routes']}>
                      <Button variant="outline" size="sm" onClick={() => onAssign(agent)}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <Button variant="outline" size="sm" onClick={() => onPerformance(agent)}>
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

// Simple placeholder components for other tabs
const AgentsAssignment = ({ agents }: { agents: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Assignment & Training Management</CardTitle>
      <CardDescription>Manage agent assignments and training programs</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Assignment and training management features will be implemented here.</p>
    </CardContent>
  </Card>
);

const AgentsTracking = () => (
  <Card>
    <CardHeader>
      <CardTitle>Service Tracking</CardTitle>
      <CardDescription>Track service delivery and agent performance</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Service tracking features will be implemented here.</p>
    </CardContent>
  </Card>
);

const AgentsAnalytics = ({ agents }: { agents: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Analytics Dashboard</CardTitle>
      <CardDescription>Agent performance analytics and insights</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Analytics dashboard will be implemented here.</p>
    </CardContent>
  </Card>
);

// Main Agents Page Component
const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignRoutesModalOpen, setAssignRoutesModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  
  const { selectedProject, currentProject } = useProject();
  const { hasPermission } = useRBAC();
  const { projectAgents, getFilteredAgents } = useAgentData();
  
  const filteredAgents = getFilteredAgents(searchTerm);

  const handleAgentAdded = (agent: any) => {
    console.log('Agent added:', agent);
  };

  if (!currentProject) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h2 className="text-2xl font-bold">Service Agents</h2>
            <p className="text-muted-foreground">Please select a project to view agents</p>
          </div>
          <PermissionGate permissions={['onboard_agents']}>
            <AddNewAgentForm onAgentAdded={handleAgentAdded} />
          </PermissionGate>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
            <p className="text-gray-600">Please select a project from the sidebar to view agents.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PermissionGate permissions={['view_agents']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h2 className="text-2xl font-bold">Service Agents - {currentProject.name}</h2>
            <p className="text-muted-foreground">{currentProject.description}</p>
          </div>
          <PermissionGate permissions={['onboard_agents']}>
            <AddNewAgentForm onAgentAdded={handleAgentAdded} />
          </PermissionGate>
        </div>

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
            <AgentsManagement
              agents={filteredAgents}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onView={(agent) => {
                setSelectedAgent(agent);
                setViewModalOpen(true);
              }}
              onEdit={(agent) => {
                setSelectedAgent(agent);
                setEditModalOpen(true);
              }}
              onAssign={(agent) => {
                setSelectedAgent(agent);
                setAssignRoutesModalOpen(true);
              }}
              onPerformance={(agent) => {
                setSelectedAgent(agent);
                setPerformanceModalOpen(true);
              }}
            />
          </TabsContent>

          {hasPermission('assign_routes') && (
            <TabsContent value="assignment">
              <AgentsAssignment agents={projectAgents} />
            </TabsContent>
          )}

          {hasPermission('track_services') && (
            <TabsContent value="delivery">
              <AgentsTracking />
            </TabsContent>
          )}

          {hasPermission('view_analytics') && (
            <TabsContent value="analytics">
              <AgentsAnalytics agents={projectAgents} />
            </TabsContent>
          )}
        </Tabs>

        {/* Modals */}
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
    </PermissionGate>
  );
};

export default AgentsPage;
