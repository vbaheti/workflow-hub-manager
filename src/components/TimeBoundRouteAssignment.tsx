
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, MapPin, Plus, Clock, Navigation, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import NewRouteForm from './NewRouteForm';
import { useProject } from '../contexts/ProjectContext';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  location: string;
  state?: string;
}

interface RouteAssignment {
  id: string;
  agentId: number;
  agentName: string;
  routeName: string;
  visitDate: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  coordinates: { lat: number; lng: number; address: string }[];
  notes: string;
  plannedStops: number;
  actualStops?: number;
  efficiency?: number;
  state?: string;
}

interface TimeBoundRouteAssignmentProps {
  agents: Agent[];
  projectId: string;
}

const TimeBoundRouteAssignment = ({ agents, projectId }: TimeBoundRouteAssignmentProps) => {
  const { filters } = useProject();
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
      efficiency: 95,
      state: 'New York'
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
      efficiency: 100,
      state: 'California'
    },
    {
      id: '3',
      agentId: 3,
      agentName: 'Mike Davis',
      routeName: 'Chicago Loop',
      visitDate: new Date('2024-06-17'),
      startTime: '10:00',
      endTime: '18:00',
      status: 'in-progress',
      coordinates: [
        { lat: 41.8781, lng: -87.6298, address: '233 S Wacker Dr, Chicago, IL 60606' }
      ],
      notes: 'Downtown area coverage',
      plannedStops: 4,
      actualStops: 2,
      efficiency: 85,
      state: 'Illinois'
    }
  ]);

  const [showNewRouteForm, setShowNewRouteForm] = useState(false);

  // Filter assignments based on global filters
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      // Filter by agents that are already filtered by project and state
      const agentExists = agents.some(agent => agent.id === assignment.agentId);
      if (!agentExists) return false;
      
      // Additional state filter for assignments
      if (filters.state !== 'all') {
        const matchesState = assignment.state === filters.state;
        if (!matchesState) return false;
      }
      
      return true;
    });
  }, [assignments, agents, filters.state]);

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>,
      'in-progress': <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>,
      completed: <Badge className="bg-green-100 text-green-800">Completed</Badge>,
      cancelled: <Badge variant="secondary">Cancelled</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const getEfficiencyIndicator = (efficiency?: number) => {
    if (!efficiency) return null;
    
    if (efficiency >= 90) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (efficiency >= 70) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  if (showNewRouteForm) {
    return (
      <NewRouteForm
        agents={agents}
        projectId={projectId}
        onRouteCreated={() => setShowNewRouteForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Time-bound Route Assignments</h3>
          <p className="text-sm text-muted-foreground">Schedule agent visits with specific dates, times, and performance tracking</p>
          {filters.state !== 'all' && (
            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
              Filtered by: {filters.state}
            </Badge>
          )}
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewRouteForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Route
        </Button>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{filteredAssignments.length}</p>
                {filters.state !== 'all' && (
                  <p className="text-xs text-gray-500">in {filters.state}</p>
                )}
              </div>
              <Navigation className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAssignments.filter(a => a.status === 'completed').length}
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredAssignments.filter(a => a.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredAssignments.filter(a => a.efficiency).length > 0 ? 
                    Math.round(filteredAssignments
                      .filter(a => a.efficiency)
                      .reduce((sum, a) => sum + (a.efficiency || 0), 0) / 
                      filteredAssignments.filter(a => a.efficiency).length) : 0}%
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
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
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-blue-600" />
                      <span>{assignment.routeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {assignment.state}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{format(assignment.visitDate, "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{assignment.startTime} - {assignment.endTime}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">
                          {assignment.actualStops || 0}/{assignment.plannedStops}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getEfficiencyIndicator(assignment.efficiency)}
                      <span className="text-sm font-medium">
                        {assignment.efficiency ? `${assignment.efficiency}%` : 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{assignment.notes || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">
              No assignments match the current filters.
              {filters.state !== 'all' && ` Try selecting a different state or `}
              Create a new route assignment to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeBoundRouteAssignment;
