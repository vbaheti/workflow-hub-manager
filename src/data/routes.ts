
import { RouteInfo } from "@/types";

export const allRoutes: RouteInfo[] = [
  { id: 1, name: "Manhattan District", city: "New York", coverage: "Financial District, Midtown", assignedAgent: "John Smith", priority: "High" },
  { id: 2, name: "Brooklyn Heights", city: "New York", coverage: "Brooklyn Heights, DUMBO", assignedAgent: "John Smith", priority: "Medium" },
  { id: 3, name: "Hollywood District", city: "Los Angeles", coverage: "Hollywood, West Hollywood", assignedAgent: "Sarah Johnson", priority: "High" },
  { id: 4, name: "Santa Monica", city: "Los Angeles", coverage: "Santa Monica, Venice", assignedAgent: "Sarah Johnson", priority: "Medium" },
  { id: 5, name: "Downtown Chicago", city: "Chicago", coverage: "Loop, River North", assignedAgent: "Mike Davis", priority: "High" },
  { id: 6, name: "Financial District", city: "San Francisco", coverage: "FiDi, SOMA", assignedAgent: "Emily Chen", priority: "High" },
  { id: 7, name: "Mission Bay", city: "San Francisco", coverage: "Mission Bay, Potrero Hill", assignedAgent: "Emily Chen", priority: "Medium" },
  { id: 8, name: "South Beach", city: "Miami", coverage: "South Beach, Art Deco District", assignedAgent: "Robert Wilson", priority: "High" },
  { id: 9, name: "Brickell", city: "Miami", coverage: "Brickell, Downtown Miami", assignedAgent: "Robert Wilson", priority: "Medium" },
  { id: 10, name: "Queens Central", city: "New York", coverage: "Astoria, Long Island City", assignedAgent: "Unassigned", priority: "Low" }
];
