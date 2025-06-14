
import { useState, useMemo } from 'react';
import { useProject } from '../contexts/ProjectContext';

// Mock data for agents
const mockAgents = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0101',
    projectId: 'project-1',
    status: 'active',
    role: 'Senior Agent'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0102',
    projectId: 'project-1', 
    status: 'active',
    role: 'Agent'
  }
];

const mockProjects = [
  {
    id: 'project-1',
    name: 'Project Alpha',
    description: 'Main project for service delivery'
  },
  {
    id: 'project-2', 
    name: 'Project Beta',
    description: 'Secondary project for testing'
  }
];

export const useAgentData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedProject } = useProject();

  const currentProject = useMemo(() => {
    if (!selectedProject) return mockProjects[0]; // Default fallback
    return mockProjects.find(p => p.id === selectedProject) || mockProjects[0];
  }, [selectedProject]);

  const projectAgents = useMemo(() => {
    if (!currentProject) return [];
    return mockAgents.filter(agent => agent.projectId === currentProject.id);
  }, [currentProject]);

  const filteredAgents = useMemo(() => {
    if (!searchTerm) return projectAgents;
    return projectAgents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projectAgents, searchTerm]);

  return {
    filteredAgents,
    projectAgents,
    searchTerm,
    setSearchTerm,
    currentProject
  };
};
