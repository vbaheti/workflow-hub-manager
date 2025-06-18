
import { useMemo } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useStateContext } from '../contexts/StateContext';
import { useAgents } from './useAgents';

const useAgentData = () => {
  const { currentProject } = useProject();
  const { selectedStates } = useStateContext();
  const { agents: allAgents, loading, error } = useAgents();

  const getProjectStates = (projectName: string): string[] => {
    if (projectName.toLowerCase().includes("delhi")) return ["Delhi"];
    if (projectName.toLowerCase().includes("mumbai")) return ["Maharashtra"];
    if (projectName.toLowerCase().includes("bangalore") || projectName.toLowerCase().includes("karnataka")) return ["Karnataka"];
    if (projectName.toLowerCase().includes("dhaka")) return ["West Bengal"];
    if (projectName.toLowerCase().includes("dubai") || projectName.toLowerCase().includes("uae")) return ["Rajasthan"];
    return ["Delhi", "Maharashtra", "West Bengal"];
  };

  const projectAgents = useMemo(() => {
    if (!currentProject) return allAgents;

    return allAgents.filter(agent => {
      const routeMatch = selectedStates.length === 0
        ? true
        : agent.assigned_routes?.some((r: string) =>
            selectedStates.some((state) => r.toLowerCase().includes(state.toLowerCase()))
          );
      
      const projectStates = getProjectStates(currentProject.name);
      const mappedState = selectedStates.length === 0
        ? true
        : selectedStates.some((s) => projectStates.includes(s));
      
      return routeMatch || mappedState;
    });
  }, [currentProject, selectedStates, allAgents]);

  const getFilteredAgents = (searchTerm: string) => {
    return projectAgents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    allAgents,
    projectAgents,
    getFilteredAgents,
    loading,
    error
  };
};

export default useAgentData;
