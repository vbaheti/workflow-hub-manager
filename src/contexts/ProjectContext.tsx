
import React, { createContext, useContext, useState, ReactNode } from 'react';

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

const defaultProjects: Project[] = [
  {
    id: 'project-alpha',
    name: 'Project Alpha',
    status: 'active',
    agentCount: 3,
    routeCount: 5,
    description: 'Manhattan and Brooklyn field operations'
  },
  {
    id: 'project-beta',
    name: 'Project Beta',
    status: 'active',
    agentCount: 2,
    routeCount: 4,
    description: 'West Coast expansion initiative'
  },
  {
    id: 'project-gamma',
    name: 'Project Gamma',
    status: 'on-hold',
    agentCount: 1,
    routeCount: 2,
    description: 'Chicago market research'
  }
];

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [selectedProject, setSelectedProject] = useState('project-alpha');

  const currentProject = defaultProjects.find(p => p.id === selectedProject);

  const value = {
    selectedProject,
    setSelectedProject,
    projects: defaultProjects,
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
