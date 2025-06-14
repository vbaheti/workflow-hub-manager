
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, MapPin, Plus, Clock, Navigation, Edit, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { format } from 'date-fns';
import NewRouteForm from './NewRouteForm';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  location: string;
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
  checkInSchedule: { time: string; location: string; completed: boolean }[];
}

interface TimeBoundRouteAssignmentProps {
  agents: Agent[];
  projectId: string;
}

const TimeBoundRouteAssignment = ({ agents, projectId }: TimeBoundRouteAssignmentProps) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<RouteAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      routeName: 'Central Delhi Circuit',
      visitDate: new Date('2024-06-15'),
      startTime: '09:00',
      endTime: '17:00',
      status: 'scheduled',
      coordinates: [
        { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
        { lat: 28.6304, lng: 77.2177, address: 'Karol Bagh, New Delhi' },
        { lat: 28.6562, lng: 77.2410, address: 'CP Metro Station, New Delhi' }
      ],
      notes: 'Focus on high-priority clients, document verification required',
      plannedStops: 3,
      actualStops: 3,
      efficiency: 95,
      checkInSchedule: [
        { time: '09:00', location: 'Connaught Place', completed: true },
        { time: '12:30', location: 'Karol Bagh', completed: true },
        { time: '15:00', location: 'CP Metro Station', completed: false }
      ]
    },
    {
      id: '2',
      agentId: 2,
      agentName: 'Priya Sharma',
      routeName: 'Mumbai Financial District',
      visitDate: new Date('2024-06-15'),
      startTime: '10:00',
      endTime: '16:00',
      status: 'in-progress',
      coordinates: [
        { lat: 19.0760, lng: 72.8777, address: 'Bandra West, Mumbai' },
        { lat: 19.1136, lng: 72.8697, address: 'Andheri East, Mumbai' }
      ],
      notes: 'Client meetings scheduled, carry portable scanner',
      plannedStops: 2,
      actualStops: 1,
      efficiency: 80,
      checkInSchedule: [
        { time: '10:00', location: 'Bandra West', completed: true },
        { time: '13:00', location: 'Andheri East', completed: false }
      ]
    },
    {
      id: '3',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      routeName: 'South Delhi Premium',
      visitDate: new Date('2024-06-15'),
      startTime: '16:30',
      endTime: '19:00',
      status: 'scheduled',
      coordinates: [
        { lat: 28.5355, lng: 77.2487, address: 'Greater Kailash, New Delhi' }
      ],
      notes: 'Evening shift for premium clients',
      plannedStops: 1,
      checkInSchedule: [
        { time: '16:30', location: 'Greater Kailash', completed: false }
      ]
    }
  ]);

  const [showNewRouteForm, setShowNewRouteForm] = useState(false);

  const checkTimeConflicts = (agentId: number, newStartTime: string, newEndTime: string, newDate: Date, excludeAssignmentId?: string) => {
    const agentAssignments = assignments.filter(assignment => 
      assignment.agentId === agentId && 
      assignment.id !== excludeAssignmentId &&
      format(assignment.visitDate, 'yyyy-MM-dd') === format(newDate, 'yyyy-MM-dd') &&
      assignment.status !== 'cancelled'
    );

    const newStart = parseInt(newStartTime.replace(':', ''));
    const newEnd = parseInt(newEndTime.replace(':', ''));

    return agentAssignments.some(assignment => {
      const existingStart = parseInt(assignment.startTime.replace(':', ''));
      const existingEnd = parseInt(assignment.endTime.replace(':', ''));
      
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  const getAgentAvailability = (agentId: number, date: Date) => {
    const dayAssignments = assignments.filter(assignment => 
      assignment.agentId === agentId && 
      format(assignment.visitDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      assignment.status !== 'cancelled'
    );

    const totalMinutes = 8 * 60; // 8 hour work day
    const assignedMinutes = dayAssignments.reduce((total, assignment) => {
      const start = parseInt(assignment.startTime.split(':')[0]) * 60 + parseInt(assignment.startTime.split(':')[1]);
      const end = parseInt(assignment.endTime.split(':')[0]) * 60 + parseInt(assignment.endTime.split(':')[1]);
      return total + (end - start);
    }, 0);

    return Math.max(0, ((totalMinutes - assignedMinutes) / totalMinutes) * 100);
  };

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
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getConflictingAssignments = () => {
    const conflicts: { assignment: RouteAssignment; conflictsWith: RouteAssignment[] }[] = [];
    
    assignments.forEach(assignment => {
      if (assignment.status === 'cancelled') return;
      
      const conflictsWith = assignments.filter(other => 
        other.id !== assignment.id &&
        other.agentId === assignment.agentId &&
        format(other.visitDate, 'yyyy-MM-dd') === format(assignment.visitDate, 'yyyy-MM-dd') &&
        other.status !== 'cancelled' &&
        checkTimeConflicts(assignment.agentId, assignment.startTime, assignment.endTime, assignment.visitDate, assignment.id)
      );
      
      if (conflictsWith.length > 0) {
        conflicts.push({ assignment, conflictsWith });
      }
    });
    
    return conflicts;
  };

  const filteredAssignments = assignments.filter(assignment => 
    agents.some(agent => agent.id === assignment.agentId)
  );

  const conflicts = getConflictingAssignments();

  if (showNewRouteForm) {
    return (
      <NewRouteForm
        agents={agents}
        projectId={projectId}
        onRouteCreated={() => setShowNewRouteForm(false)}
        onConflictCheck={(agentId, startTime, endTime, date) => 
          checkTimeConflicts(agentId, startTime, endTime, date)
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Time-bound Route Assignments</h3>
          <p className="text-sm text-muted-foreground">Schedule agent visits with conflict detection and availability tracking</p>
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
                <p className="text-sm font-medium text-gray-600">Conflicts</p>
                <p className="text-2xl font-bold text-red-600">{conflicts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Warnings */}
      {conflicts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Schedule Conflicts Detected:</strong> {conflicts.length} assignment(s) have time overlaps. 
            Please review and reschedule to avoid conflicts.
            <div className="mt-2 space-y-1">
              {conflicts.slice(0, 3).map((conflict, index) => (
                <div key={index} className="text-sm">
                  • {conflict.assignment.agentName}: {conflict.assignment.routeName} conflicts with {conflict.conflictsWith.length} other assignment(s)
                </div>
              ))}
              {conflicts.length > 3 && (
                <div className="text-sm">• And {conflicts.length - 3} more conflicts...</div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Agent Availability Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Availability Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => {
              const availability = getAgentAvailability(agent.id, new Date());
              const todayAssignments = filteredAssignments.filter(assignment => 
                assignment.agentId === agent.id && 
                format(assignment.visitDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              );
              
              return (
                <div key={agent.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Availability:</span>
                      <span className={availability > 50 ? 'text-green-600' : availability > 20 ? 'text-yellow-600' : 'text-red-600'}>
                        {availability.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Assignments:</span>
                      <span>{todayAssignments.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${availability > 50 ? 'bg-green-500' : availability > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.max(100 - availability, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-ins</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => {
                const hasConflict = conflicts.some(c => c.assignment.id === assignment.id);
                const completedCheckins = assignment.checkInSchedule?.filter(c => c.completed).length || 0;
                const totalCheckins = assignment.checkInSchedule?.length || 0;
                
                return (
                  <TableRow key={assignment.id} className={hasConflict ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {assignment.agentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{assignment.agentName}</span>
                        {hasConflict && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-blue-600" />
                        <span>{assignment.routeName}</span>
                      </div>
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
                        <Users className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{completedCheckins}/{totalCheckins}</span>
                        {totalCheckins > 0 && (
                          <div className="w-12 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${(completedCheckins / totalCheckins) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </TableCell>
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
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeBoundRouteAssignment;
