
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, MapPin } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  agentCount: number;
  routeCount: number;
  description: string;
}

interface ProjectSelectorProps {
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  projects: Project[];
}

const ProjectSelector = ({ selectedProject, onProjectChange, projects }: ProjectSelectorProps) => {
  const currentProject = projects.find(p => p.id === selectedProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedProject} onValueChange={onProjectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentProject && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{currentProject.name}</h3>
                <p className="text-sm text-muted-foreground">{currentProject.description}</p>
              </div>
              <Badge className={getStatusColor(currentProject.status)}>
                {currentProject.status}
              </Badge>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{currentProject.agentCount} agents</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">{currentProject.routeCount} routes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectSelector;
