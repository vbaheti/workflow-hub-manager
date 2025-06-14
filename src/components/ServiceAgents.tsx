
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Mail, Phone, MapPin, MoreHorizontal, Route, BarChart3, TrendingUp, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import RouteAssignment from './RouteAssignment';
import AgentAnalytics from './AgentAnalytics';

const ServiceAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const agents = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      status: "active",
      performance: "excellent",
      joinDate: "2023-01-15",
      totalCollections: "$45,200",
      assignedRoutes: ["Manhattan District", "Brooklyn Heights"],
      projects: ["Project Alpha", "Project Beta"],
      avatar: ""
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
      status: "active",
      performance: "good",
      joinDate: "2023-03-20",
      totalCollections: "$38,900",
      assignedRoutes: ["Hollywood District", "Santa Monica"],
      projects: ["Project Beta", "Project Gamma"],
      avatar: ""
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@company.com",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      status: "inactive",
      performance: "average",
      joinDate: "2022-11-10",
      totalCollections: "$29,500",
      assignedRoutes: ["Downtown Chicago"],
      projects: ["Project Alpha"],
      avatar: ""
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@company.com",
      phone: "+1 (555) 456-7890",
      location: "San Francisco, CA",
      status: "active",
      performance: "excellent",
      joinDate: "2023-05-08",
      totalCollections: "$52,100",
      assignedRoutes: ["Financial District", "Mission Bay"],
      projects: ["Project Delta", "Project Epsilon"],
      avatar: ""
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      phone: "+1 (555) 567-8901",
      location: "Miami, FL",
      status: "active",
      performance: "good",
      joinDate: "2023-02-14",
      totalCollections: "$41,800",
      assignedRoutes: ["South Beach", "Brickell"],
      projects: ["Project Gamma", "Project Delta"],
      avatar: ""
    }
  ];

  const filteredAgents = agents.filter(agent =>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Agents</h2>
          <p className="text-muted-foreground">Manage agents, routes, and performance analytics</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Route Assignment
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
              <CardDescription>Overview of all service agents and their performance</CardDescription>
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
                          {agent.projects.map((project, index) => (
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Agent</DropdownMenuItem>
                            <DropdownMenuItem>Assign Routes</DropdownMenuItem>
                            <DropdownMenuItem>View Performance</DropdownMenuItem>
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
          <RouteAssignment agents={agents} />
        </TabsContent>

        <TabsContent value="analytics">
          <AgentAnalytics agents={agents} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceAgents;
