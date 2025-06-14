
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, MapPin, Calendar, Filter } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

interface FilterBarProps {
  showStateFilter?: boolean;
  showPeriodFilter?: boolean;
  userRole?: 'admin' | 'supervisor' | 'agent';
}

const FilterBar = ({ 
  showStateFilter = true, 
  showPeriodFilter = true,
  userRole = 'admin' 
}: FilterBarProps) => {
  const { 
    selectedProject, 
    setSelectedProject, 
    selectedState, 
    setSelectedState,
    selectedPeriod,
    setSelectedPeriod,
    projects, 
    currentProject,
    availableStates
  } = useProject();

  const periods = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-quarter', label: 'This Quarter' },
    { value: 'this-year', label: 'This Year' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Only show filters based on user role
  const canViewProjectFilter = ['admin', 'supervisor'].includes(userRole);
  const canViewStateFilter = showStateFilter && ['admin', 'supervisor'].includes(userRole);
  const canViewPeriodFilter = showPeriodFilter;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {canViewProjectFilter && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <span>{project.name}</span>
                        <Badge className={getStatusColor(project.status)} variant="secondary">
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {canViewStateFilter && availableStates.length > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {availableStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {canViewPeriodFilter && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentProject && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="outline" className="text-xs">
                {currentProject.agentCount} agents
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentProject.routeCount} routes
              </Badge>
              {selectedState !== 'all' && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  {selectedState}
                </Badge>
              )}
            </div>
          )}
        </div>

        {currentProject && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-600">{currentProject.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterBar;
