import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Building2, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import NewAssignmentForm from './NewAssignmentForm';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  location: string;
  status: string;
  projects: string[];
}

interface ProjectAssignment {
  id: string;
  agentId: number;
  agentName: string;
  projectId: string;
  projectName: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'pending' | 'completed' | 'suspended';
  workload: number; // percentage
}

interface AgentProjectAssignmentProps {
  agents: Agent[];
}

const AgentProjectAssignment = ({ agents }: AgentProjectAssignmentProps) => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'mumbai-fin',
      projectName: 'Mumbai Financial Hub',
      role: 'Senior Agent',
      startDate: new Date('2024-01-15'),
      status: 'active',
      workload: 80
    },
    {
      id: '2',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'delhi-net',
      projectName: 'Delhi Service Network',
      role: 'Team Lead',
      startDate: new Date('2024-03-01'),
      status: 'active',
      workload: 60
    },
    {
      id: '3',
      agentId: 2,
      agentName: 'Priya Sharma',
      projectId: 'mumbai-fin',
      projectName: 'Mumbai Financial Hub',
      role: 'Agent',
      startDate: new Date('2024-02-01'),
      status: 'active',
      workload: 100
    }
  ]);

  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);

  const availableProjects = [
    { id: 'mumbai-fin', name: 'Mumbai Financial Hub' },
    { id: 'delhi-net', name: 'Delhi Service Network' },
    { id: 'bangalore-tech', name: 'Bangalore Tech Corridor' },
    { id: 'dhaka-urban', name: 'Dhaka Urban Services' },
    { id: 'dubai-business', name: 'Dubai Business Services' }
  ];

  const getAgentAssignments = (agentId: number) => {
    return assignments.filter(assignment => assignment.agentId === agentId);
  };

  const getTotalWorkload = (agentId: number) => {
    return getAgentAssignments(agentId)
      .filter(assignment => assignment.status === 'active')
      .reduce((total, assignment) => total + assignment.workload, 0);
  };

  const checkWorkloadConflict = (agentId: number, newWorkload: number) => {
    const currentWorkload = getTotalWorkload(agentId);
    return currentWorkload + newWorkload > 100;
  };

  const handleNewAssignment = (newAssignment: any) => {
    setAssignments([...assignments, newAssignment]);
    setShowNewAssignmentForm(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: <Badge className="bg-green-100 text-green-800">Active</Badge>,
      pending: <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
      completed: <Badge className="bg-blue-100 text-blue-800">Completed</Badge>,
      suspended: <Badge variant="secondary">Suspended</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const getWorkloadIndicator = (workload: number) => {
    if (workload > 100) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    } else if (workload >= 90) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const handleAssignToProject = (agentId: number, projectId: string, workload: number) => {
    if (checkWorkloadConflict(agentId, workload)) {
      toast({
        title: "Assignment Conflict",
        description: "This assignment would exceed the agent's capacity (100%).",
        variant: "destructive"
      });
      return;
    }

    const agent = agents.find(a => a.id === agentId);
    const project = availableProjects.find(p => p.id === projectId);
    
    if (agent && project) {
      const newAssignment: ProjectAssignment = {
        id: Date.now().toString(),
        agentId,
        agentName: agent.name,
        projectId,
        projectName: project.name,
        role: 'Agent',
        startDate: new Date(),
        status: 'pending',
        workload
      };
      
      setAssignments([...assignments, newAssignment]);
      toast({
        title: "Assignment Created",
        description: `${agent.name} has been assigned to ${project.name}.`
      });
    }
  };

  const filteredAgents = agents.filter(agent => agent.status === 'active');

  if (showNewAssignmentForm) {
    return (
      <NewAssignmentForm
        agents={filteredAgents}
        projects={availableProjects}
        onAssignmentCreated={handleNewAssignment}
        onCancel={() => setShowNewAssignmentForm(false)}
        onConflictCheck={checkWorkloadConflict}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Agent-to-Project Assignments</h3>
          <p className="text-sm text-muted-foreground">Manage agent workload and project assignments</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewAssignmentForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assignment
        </Button>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-blue-600">{filteredAgents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-green-600">
                  {assignments.filter(a => a.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overloaded Agents</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredAgents.filter(agent => getTotalWorkload(agent.id) > 100).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Projects</p>
                <p className="text-2xl font-bold text-purple-600">{availableProjects.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Assignment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Current Projects</TableHead>
                <TableHead>Total Workload</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => {
                const agentAssignments = getAgentAssignments(agent.id);
                const totalWorkload = getTotalWorkload(agent.id);
                const hasConflict = totalWorkload > 100;
                
                return (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{agent.name}</span>
                          <p className="text-xs text-gray-500">{agent.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {agentAssignments.length === 0 ? (
                          <Badge variant="secondary">No assignments</Badge>
                        ) : (
                          agentAssignments.map((assignment, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {assignment.projectName}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                ({assignment.workload}%)
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getWorkloadIndicator(totalWorkload)}
                        <span className={`font-medium ${hasConflict ? 'text-red-600' : 'text-gray-900'}`}>
                          {totalWorkload}%
                        </span>
                      </div>
                      {hasConflict && (
                        <p className="text-xs text-red-600 mt-1">Over capacity</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agent.status)}
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => {
                        const [projectId, workload] = value.split(':');
                        handleAssignToProject(agent.id, projectId, parseInt(workload));
                      }}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Assign to project" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProjects.map(project => (
                            <SelectItem key={project.id} value={`${project.id}:50`}>
                              {project.name} (50%)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Conflict Warnings */}
      {filteredAgents.some(agent => getTotalWorkload(agent.id) > 100) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Workload Conflicts Detected:</strong> Some agents are assigned to more than 100% capacity. 
            Please review and redistribute assignments to ensure optimal performance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AgentProjectAssignment;
