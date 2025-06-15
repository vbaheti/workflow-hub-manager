
import { useMemo } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useStateContext } from '../contexts/StateContext';

const useAgentData = () => {
  const { currentProject } = useProject();
  const { selectedStates } = useStateContext();

  const allAgents = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      phone: "+91 98765 43210",
      location: "Delhi, India",
      status: "active",
      performance: "excellent",
      joinDate: "2023-01-15",
      totalCollections: "₹4,52,000",
      assignedRoutes: ["Central Delhi", "Connaught Place"],
      projects: ["Mumbai Financial Hub", "Delhi Service Network"],
      avatar: ""
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      phone: "+91 87654 32109",
      location: "Mumbai, India",
      status: "active",
      performance: "good",
      joinDate: "2023-03-20",
      totalCollections: "₹3,89,000",
      assignedRoutes: ["Bandra West", "Andheri East"],
      projects: ["Mumbai Financial Hub", "Bangalore Tech Corridor"],
      avatar: ""
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@company.com",
      phone: "+880 1712 345678",
      location: "Dhaka, Bangladesh",
      status: "inactive",
      performance: "average",
      joinDate: "2022-11-10",
      totalCollections: "৳2,95,000",
      assignedRoutes: ["Gulshan District"],
      projects: ["Dhaka Urban Services"],
      avatar: ""
    },
    {
      id: 4,
      name: "Fatima Al-Zahra",
      email: "fatima.alzahra@company.com",
      phone: "+971 50 123 4567",
      location: "Dubai, UAE",
      status: "active",
      performance: "excellent",
      joinDate: "2023-05-08",
      totalCollections: "AED 521,000",
      assignedRoutes: ["Business Bay", "DIFC"],
      projects: ["UAE Business Services", "Dubai Financial District"],
      avatar: ""
    },
    {
      id: 5,
      name: "Chen Wei Ming",
      email: "chen.weiming@company.com",
      phone: "+65 8765 4321",
      location: "Singapore",
      status: "active",
      performance: "good",
      joinDate: "2023-02-14",
      totalCollections: "S$418,000",
      assignedRoutes: ["Marina Bay", "Raffles Place"],
      projects: ["Singapore Financial Hub", "Southeast Asia Expansion"],
      avatar: ""
    },
    {
      id: 6,
      name: "Amara Okafor",
      email: "amara.okafor@company.com",
      phone: "+234 803 123 4567",
      location: "Lagos, Nigeria",
      status: "active",
      performance: "excellent",
      joinDate: "2023-04-12",
      totalCollections: "₦12,500,000",
      assignedRoutes: ["Victoria Island", "Ikoyi"],
      projects: ["Lagos Commercial Hub", "West Africa Network"],
      avatar: ""
    }
  ];

  const getProjectStates = (projectName: string): string[] => {
    if (projectName.toLowerCase().includes("delhi")) return ["Delhi"];
    if (projectName.toLowerCase().includes("mumbai")) return ["Maharashtra"];
    if (projectName.toLowerCase().includes("bangalore") || projectName.toLowerCase().includes("karnataka")) return ["Karnataka"];
    if (projectName.toLowerCase().includes("dhaka")) return ["West Bengal"];
    if (projectName.toLowerCase().includes("dubai") || projectName.toLowerCase().includes("uae")) return ["Rajasthan"];
    return ["Delhi", "Maharashtra", "West Bengal"];
  };

  const projectAgents = useMemo(() => {
    return allAgents.filter(agent => {
      if (!currentProject) return false;
      const agentInProject = agent.projects.includes(currentProject.name);
      const routeMatch =
        selectedStates.length === 0
          ? true
          : agent.assignedRoutes.some(
              (r: string) =>
                selectedStates.some((state) => r.toLowerCase().includes(state.toLowerCase()))
            );
      const projectStates = getProjectStates(currentProject.name);
      const mappedState =
        selectedStates.length === 0
          ? true
          : selectedStates.some((s) => projectStates.includes(s));
      return agentInProject && (routeMatch || mappedState);
    });
  }, [currentProject, selectedStates, allAgents]);

  const getFilteredAgents = (searchTerm: string) => {
    return projectAgents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    allAgents,
    projectAgents,
    getFilteredAgents
  };
};

export default useAgentData;
