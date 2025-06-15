
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Target, Plus, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import NewServiceAssignmentForm from './NewServiceAssignmentForm';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  location: string;
  status: string;
}

interface ServiceAssignment {
  id: string;
  agentId: number;
  agentName: string;
  projectId: string;
  serviceName: string;
  serviceType: 'fee_collection' | 'document_verification' | 'client_onboarding' | 'compliance_check' | 'field_survey';
  monthlyTarget: number;
  currentProgress: number;
  targetUnit: 'clients' | 'amount' | 'documents' | 'visits';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

interface ServiceAssignmentProps {
  agents: Agent[];
}

const ServiceAssignment = ({ agents }: ServiceAssignmentProps) => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'mumbai-fin',
      serviceName: 'Premium Client Fee Collection',
      serviceType: 'fee_collection',
      monthlyTarget: 500000,
      currentProgress: 380000,
      targetUnit: 'amount',
      startDate: new Date('2024-01-15'),
      status: 'active',
      priority: 'high'
    },
    {
      id: '2',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'mumbai-fin',
      serviceName: 'Document Verification',
      serviceType: 'document_verification',
      monthlyTarget: 100,
      currentProgress: 75,
      targetUnit: 'documents',
      startDate: new Date('2024-01-15'),
      status: 'active',
      priority: 'medium'
    },
    {
      id: '3',
      agentId: 2,
      agentName: 'Priya Sharma',
      projectId: 'mumbai-fin',
      serviceName: 'New Client Onboarding',
      serviceType: 'client_onboarding',
      monthlyTarget: 25,
      currentProgress: 18,
      targetUnit: 'clients',
      startDate: new Date('2024-02-01'),
      status: 'active',
      priority: 'high'
    }
  ]);

  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);

  const availableServices = [
    { 
      type: 'fee_collection', 
      name: 'Fee Collection', 
      unit: 'amount',
      description: 'Collect fees from clients'
    },
    { 
      type: 'document_verification', 
      name: 'Document Verification', 
      unit: 'documents',
      description: 'Verify client documents'
    },
    { 
      type: 'client_onboarding', 
      name: 'Client Onboarding', 
      unit: 'clients',
      description: 'Onboard new clients'
    },
    { 
      type: 'compliance_check', 
      name: 'Compliance Check', 
      unit: 'visits',
      description: 'Conduct compliance visits'
    },
    { 
      type: 'field_survey', 
      name: 'Field Survey', 
      unit: 'visits',
      description: 'Conduct field surveys'
    }
  ];

  const getAgentAssignments = (agentId: number) => {
    return assignments.filter(assignment => assignment.agentId === agentId);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressBadge = (current: number, target: number) => {
    const percentage = getProgressPercentage(current, target);
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
    if (percentage >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Behind</Badge>;
    return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'amount') {
      return `₹${value.toLocaleString()}`;
    }
    return `${value} ${unit}`;
  };

  const handleNewAssignment = (newAssignment: any) => {
    setAssignments([...assignments, newAssignment]);
    setShowNewAssignmentForm(false);
  };

  const filteredAgents = agents.filter(agent => agent.status === 'active');

  const getServiceStats = () => {
    const totalAssignments = assignments.length;
    const onTrackCount = assignments.filter(a => getProgressPercentage(a.currentProgress, a.monthlyTarget) >= 90).length;
    const criticalCount = assignments.filter(a => getProgressPercentage(a.currentProgress, a.monthlyTarget) < 70).length;
    
    return { totalAssignments, onTrackCount, criticalCount };
  };

  const stats = getServiceStats();

  if (showNewAssignmentForm) {
    return (
      <NewServiceAssignmentForm
        agents={filteredAgents}
        services={availableServices}
        projectId={currentProject?.id || ''}
        onAssignmentCreated={handleNewAssignment}
        onCancel={() => setShowNewAssignmentForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Service Assignment & Targets</h3>
          <p className="text-sm text-muted-foreground">Assign specific services to agents with performance targets</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewAssignmentForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Assign Service
        </Button>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalAssignments}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-green-600">{stats.onTrackCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-purple-600">{filteredAgents.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Assignment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Assignments & Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const progressPercentage = getProgressPercentage(assignment.currentProgress, assignment.monthlyTarget);
                
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {assignment.agentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{assignment.agentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{assignment.serviceName}</span>
                        <Badge variant="outline" className="text-xs">
                          {assignment.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatValue(assignment.monthlyTarget, assignment.targetUnit)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{formatValue(assignment.currentProgress, assignment.targetUnit)}</span>
                          <span>{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              progressPercentage >= 90 ? 'bg-green-500' : 
                              progressPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getProgressBadge(assignment.currentProgress, assignment.monthlyTarget)}
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="edit">Edit Target</SelectItem>
                          <SelectItem value="pause">Pause</SelectItem>
                          <SelectItem value="reassign">Reassign</SelectItem>
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

      {/* Performance Alerts */}
      {stats.criticalCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Performance Alert:</strong> {stats.criticalCount} service assignment(s) are significantly behind target. 
            Consider reassigning resources or adjusting targets to ensure project success.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ServiceAssignment;
