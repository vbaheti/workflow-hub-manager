
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  agentCount: number;
  routeCount: number;
  description: string;
}

interface ProjectContextType {
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  projects: Project[];
  currentProject: Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [selectedProject, setSelectedProject] = useState('');
  const { projects: dbProjects, loading } = useProjects();

  // Transform database projects to match the interface
  const projects: Project[] = dbProjects.map(project => ({
    id: project.id,
    name: project.name,
    status: project.status as 'active' | 'completed' | 'on-hold',
    agentCount: project.agent_count,
    routeCount: project.route_count,
    description: project.description || ''
  }));

  // Set the first project as selected when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const currentProject = projects.find(p => p.id === selectedProject);

  const value = {
    selectedProject,
    setSelectedProject,
    projects,
    currentProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
