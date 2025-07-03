
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Plus, Users, Clock, Navigation } from 'lucide-react';
import TimeBoundRouteAssignment from './TimeBoundRouteAssignment';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  state: string | null;
  district: string | null;
  status: string;
  created_at: string | null;
}

interface RouteAssignmentProps {
  agents: Agent[];
}

const RouteAssignment = ({ agents }: RouteAssignmentProps) => {
  const [showTimeBoundRoutes, setShowTimeBoundRoutes] = useState(false);

  // Convert agents to the format needed for TimeBoundRouteAssignment
  const convertedAgents = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    avatar: '', // Default empty avatar
    location: agent.location || 'Unknown'
  }));

  if (showTimeBoundRoutes) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setShowTimeBoundRoutes(false)}
          >
            ← Back to Overview
          </Button>
        </div>
        <TimeBoundRouteAssignment 
          agents={convertedAgents} 
          projectId="default-project" 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Route Assignment Overview */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Route Assignment</h3>
          <p className="text-sm text-muted-foreground">Manage agent routes and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowTimeBoundRoutes(true)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Time-bound Routes
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">Active field agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Districts covered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Average completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Routes</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{agent.location || 'Not specified'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className={agent.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">2 routes</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Assign Route
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteAssignment;
