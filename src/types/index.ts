
export interface RouteInfo {
  id: number;
  name: string;
  city: string;
  coverage: string;
  assignedAgent: string;
  priority: "High" | "Medium" | "Low";
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
  performance: 'excellent' | 'good' | 'average';
  joinDate: string;
  totalCollections: string;
  assignedRoutes: string[];
  projects: string[];
  avatar: string;
}

export interface RouteAssignment {
  id: string;
  agentId: number;
  agentName: string;
  routeName: string;
  visitDate: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  coordinates: { lat: number; lng: number; address: string }[];
  notes: string;
  plannedStops: number;
  actualStops?: number;
  efficiency?: number;
}
