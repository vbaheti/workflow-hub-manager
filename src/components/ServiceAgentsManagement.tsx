
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MoreHorizontal, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Agent = any;

interface ServiceAgentsManagementProps {
  agents: Agent[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onView: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onAssign: (agent: Agent) => void;
  onPerformance: (agent: Agent) => void;
}

const ServiceAgentsManagement: React.FC<ServiceAgentsManagementProps> = ({
  agents,
  searchTerm,
  setSearchTerm,
  onView,
  onEdit,
  onAssign,
  onPerformance
}) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Agent Management</CardTitle>
        <CardDescription>Overview of service agents in this project</CardDescription>
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
            {agents.map((agent) => (
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
                    {agent.projects.map((project: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {agent.assignedRoutes.map((route: string, index: number) => (
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
                      <DropdownMenuItem onClick={() => onView(agent)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(agent)}>Edit Agent</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAssign(agent)}>Assign Routes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPerformance(agent)}>View Performance</DropdownMenuItem>
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
  );
};

export default ServiceAgentsManagement;
