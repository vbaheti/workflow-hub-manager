
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Search, Users, Route, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '../contexts/ProjectContext';

interface Agent {
  id: number;
  name: string;
  assignedRoutes: string[];
  location: string;
  status: string;
  state?: string;
}

interface RouteAssignmentProps {
  agents: Agent[];
}

const RouteAssignment = ({ agents }: RouteAssignmentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const { toast } = useToast();
  const { filters, currentProject } = useProject();

  const allRoutes = [
    { id: 1, name: "Manhattan District", city: "New York", state: "New York", coverage: "Financial District, Midtown", assignedAgent: "John Smith", priority: "High" },
    { id: 2, name: "Brooklyn Heights", city: "New York", state: "New York", coverage: "Brooklyn Heights, DUMBO", assignedAgent: "John Smith", priority: "Medium" },
    { id: 3, name: "Hollywood District", city: "Los Angeles", state: "California", coverage: "Hollywood, West Hollywood", assignedAgent: "Sarah Johnson", priority: "High" },
    { id: 4, name: "Santa Monica", city: "Los Angeles", state: "California", coverage: "Santa Monica, Venice", assignedAgent: "Sarah Johnson", priority: "Medium" },
    { id: 5, name: "Downtown Chicago", city: "Chicago", state: "Illinois", coverage: "Loop, River North", assignedAgent: "Mike Davis", priority: "High" },
    { id: 6, name: "Financial District", city: "San Francisco", state: "California", coverage: "FiDi, SOMA", assignedAgent: "Emily Chen", priority: "High" },
    { id: 7, name: "Mission Bay", city: "San Francisco", state: "California", coverage: "Mission Bay, Potrero Hill", assignedAgent: "Emily Chen", priority: "Medium" },
    { id: 8, name: "South Beach", city: "Miami", state: "Nevada", coverage: "South Beach, Art Deco District", assignedAgent: "Robert Wilson", priority: "High" },
    { id: 9, name: "Brickell", city: "Miami", state: "Nevada", coverage: "Brickell, Downtown Miami", assignedAgent: "Robert Wilson", priority: "Medium" },
    { id: 10, name: "Queens Central", city: "New York", state: "Connecticut", coverage: "Astoria, Long Island City", assignedAgent: "Unassigned", priority: "Low" }
  ];

  // Filter routes based on global filters
  const filteredRoutes = useMemo(() => {
    return allRoutes.filter(route => {
      // Filter by current project's available states
      if (filters.state !== 'all') {
        const matchesState = route.state === filters.state;
        if (!matchesState) return false;
      }
      
      // Filter by search term
      const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           route.coverage.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      // Filter by city
      const matchesCity = selectedCity === 'all' || route.city === selectedCity;
      if (!matchesCity) return false;
      
      return true;
    });
  }, [allRoutes, filters.state, searchTerm, selectedCity]);

  const cities = Array.from(new Set(filteredRoutes.map(route => route.city)));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignRoute = (routeId: number, agentName: string) => {
    toast({
      title: "Route Assigned",
      description: `Route has been assigned to ${agentName}.`,
    });
  };

  const totalRoutes = filteredRoutes.length;
  const assignedRoutes = filteredRoutes.filter(route => route.assignedAgent !== "Unassigned").length;
  const unassignedRoutes = totalRoutes - assignedRoutes;
  const highPriorityRoutes = filteredRoutes.filter(route => route.priority === "High").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{totalRoutes}</p>
                {filters.state !== 'all' && (
                  <p className="text-xs text-gray-500">in {filters.state}</p>
                )}
              </div>
              <Route className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Routes</p>
                <p className="text-2xl font-bold text-green-600">{assignedRoutes}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-red-600">{unassignedRoutes}</p>
              </div>
              <MapPin className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{highPriorityRoutes}</p>
              </div>
              <Route className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Geographic Route Management</CardTitle>
              <p className="text-muted-foreground mt-2">Assign and manage field coverage routes for agents</p>
              {filters.state !== 'all' && (
                <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                  Filtered by: {filters.state}
                </Badge>
              )}
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Route
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search routes or coverage areas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{route.name}</h3>
                    <p className="text-sm text-gray-600">{route.city}, {route.state}</p>
                  </div>
                  <Badge className={getPriorityColor(route.priority)}>
                    {route.priority}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Coverage Area:</p>
                  <p className="text-sm text-gray-600">{route.coverage}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Assigned Agent:</p>
                    {route.assignedAgent !== "Unassigned" ? (
                      <Badge variant="outline" className="mt-1">
                        {route.assignedAgent}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1">
                        Unassigned
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                
                {route.assignedAgent === "Unassigned" && (
                  <div className="pt-2">
                    <Select onValueChange={(value) => handleAssignRoute(route.id, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Assign to agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.filter(agent => agent.status === 'active').map(agent => (
                          <SelectItem key={agent.id} value={agent.name}>
                            {agent.name} - {agent.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-600">
              No routes match the current filters. 
              {filters.state !== 'all' && ` Try selecting a different state or `}
              Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteAssignment;
