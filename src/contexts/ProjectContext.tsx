
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useDefaultValues } from './DefaultValuesContext';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  description: string;
  location: string | null;
  state: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  created_at: string;
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
  const { defaultProject } = useDefaultValues();
  const [selectedProject, setSelectedProject] = useState(defaultProject);
  const { projects: dbProjects, loading } = useProjects();

  // Transform database projects to match the interface
  const projects: Project[] = dbProjects.map(project => ({
    id: project.id,
    name: project.name,
    status: (project.status as 'active' | 'completed' | 'on-hold') || 'active',
    description: project.description || '',
    location: project.location,
    state: project.state,
    start_date: project.start_date,
    end_date: project.end_date,
    budget: project.budget,
    created_at: project.created_at
  }));

  // Set the default project when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      // Try to find the default project, otherwise use the first one
      const defaultProjectExists = projects.find(p => p.id === defaultProject);
      setSelectedProject(defaultProjectExists ? defaultProject : projects[0].id);
    }
  }, [projects, selectedProject, defaultProject]);

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
