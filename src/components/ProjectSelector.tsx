
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

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

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject,
  onProjectChange,
  projects
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Project</span>
      </div>
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center justify-between w-full">
                <span>{project.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSelector;
