
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  agentCount: number;
  routeCount: number;
  description: string;
  region: 'India' | 'South Asia' | 'South East Asia' | 'African Union';
  currency: 'INR' | 'USD' | 'SGD' | 'MYR' | 'THB' | 'USD-AF' | 'ZAR';
  currencySymbol: '₹' | '$' | 'S$' | 'RM' | '฿' | '$' | 'R';
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
    id: 'project-mumbai',
    name: 'Mumbai Metro Operations',
    status: 'active',
    agentCount: 15,
    routeCount: 8,
    description: 'Field operations across Mumbai metropolitan area',
    region: 'India',
    currency: 'INR',
    currencySymbol: '₹'
  },
  {
    id: 'project-delhi',
    name: 'Delhi NCR Expansion',
    status: 'active',
    agentCount: 22,
    routeCount: 12,
    description: 'Service expansion in Delhi-NCR region',
    region: 'India',
    currency: 'INR',
    currencySymbol: '₹'
  },
  {
    id: 'project-dhaka',
    name: 'Dhaka City Services',
    status: 'active',
    agentCount: 18,
    routeCount: 10,
    description: 'Urban service delivery in Dhaka metropolitan',
    region: 'South Asia',
    currency: 'USD',
    currencySymbol: '$'
  },
  {
    id: 'project-singapore',
    name: 'Singapore Central Hub',
    status: 'active',
    agentCount: 8,
    routeCount: 5,
    description: 'Premium service operations in Singapore',
    region: 'South East Asia',
    currency: 'SGD',
    currencySymbol: 'S$'
  },
  {
    id: 'project-kuala-lumpur',
    name: 'KL Metropolitan Services',
    status: 'active',
    agentCount: 12,
    routeCount: 7,
    description: 'Field operations in Kuala Lumpur and Selangor',
    region: 'South East Asia',
    currency: 'MYR',
    currencySymbol: 'RM'
  },
  {
    id: 'project-bangkok',
    name: 'Bangkok Urban Initiative',
    status: 'on-hold',
    agentCount: 6,
    routeCount: 4,
    description: 'Service pilot program in Bangkok',
    region: 'South East Asia',
    currency: 'THB',
    currencySymbol: '฿'
  },
  {
    id: 'project-lagos',
    name: 'Lagos Commercial Zone',
    status: 'active',
    agentCount: 25,
    routeCount: 15,
    description: 'Commercial district operations in Lagos',
    region: 'African Union',
    currency: 'USD-AF',
    currencySymbol: '$'
  },
  {
    id: 'project-johannesburg',
    name: 'Johannesburg Metro',
    status: 'active',
    agentCount: 14,
    routeCount: 9,
    description: 'Metropolitan service delivery in Johannesburg',
    region: 'African Union',
    currency: 'ZAR',
    currencySymbol: 'R'
  }
];

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [selectedProject, setSelectedProject] = useState('project-mumbai');

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
