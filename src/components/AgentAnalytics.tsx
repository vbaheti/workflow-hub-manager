
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Award, Calendar, Target, Activity } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useStateContext } from '@/contexts/StateContext';

interface Agent {
  id: number;
  name: string;
  assignedRoutes: string[];
  location: string;
  status: string;
  performance: string;
  totalCollections: string;
  projects: string[];
}

interface AgentAnalyticsProps {
  agents: Agent[];
}

const AgentAnalytics = ({ agents }: AgentAnalyticsProps) => {
  const { currentProject } = useProject();
  const { selectedStates } = useStateContext();
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Filter agents based on current context
  const filteredAgents = useMemo(() => {
    let filtered = agents;
    
    // Filter by project
    if (currentProject) {
      filtered = filtered.filter(agent => agent.projects.includes(currentProject.name));
    }
    
    // Filter by selected states
    if (selectedStates.length > 0) {
      filtered = filtered.filter(agent => 
        selectedStates.some(state => 
          agent.location.toLowerCase().includes(state.toLowerCase()) ||
          agent.assignedRoutes.some(route => route.toLowerCase().includes(state.toLowerCase()))
        )
      );
    }
    
    return filtered;
  }, [agents, currentProject, selectedStates]);

  // Dynamic performance data based on filtered agents
  const performanceData = useMemo(() => {
    return filteredAgents.map(agent => ({
      name: agent.name.split(' ')[0],
      collections: Math.floor(Math.random() * 50000) + 25000,
      target: Math.floor(Math.random() * 45000) + 35000,
      routes: agent.assignedRoutes.length,
      efficiency: Math.floor(Math.random() * 30) + 70
    }));
  }, [filteredAgents]);

  // Location-based data for heatmap
  const locationData = useMemo(() => {
    const locationMap = new Map();
    filteredAgents.forEach(agent => {
      const location = agent.location.split(',')[0];
      if (locationMap.has(location)) {
        locationMap.set(location, locationMap.get(location) + 1);
      } else {
        locationMap.set(location, 1);
      }
    });
    
    return Array.from(locationMap.entries()).map(([location, count]) => ({
      location,
      agentCount: count,
      avgPerformance: Math.floor(Math.random() * 30) + 70,
      totalCollections: count * (Math.floor(Math.random() * 40000) + 30000)
    }));
  }, [filteredAgents]);

  // Monthly trends based on selected period
  const monthlyTrendsData = useMemo(() => {
    const baseData = [
      { month: 'Jan', collections: 185000, target: 200000, agents: filteredAgents.length },
      { month: 'Feb', collections: 195000, target: 210000, agents: filteredAgents.length },
      { month: 'Mar', collections: 178000, target: 190000, agents: filteredAgents.length },
      { month: 'Apr', collections: 208000, target: 220000, agents: filteredAgents.length },
      { month: 'May', collections: 215000, target: 225000, agents: filteredAgents.length },
      { month: 'Jun', collections: 207000, target: 215000, agents: filteredAgents.length }
    ];
    
    // Adjust data based on filtered agents count
    const multiplier = filteredAgents.length / Math.max(agents.length, 1);
    return baseData.map(item => ({
      ...item,
      collections: Math.floor(item.collections * multiplier),
      target: Math.floor(item.target * multiplier)
    }));
  }, [filteredAgents.length, agents.length, selectedPeriod]);

  // Status and performance distributions
  const statusDistribution = useMemo(() => [
    { name: 'Active', value: filteredAgents.filter(a => a.status === 'active').length, color: '#10B981' },
    { name: 'Inactive', value: filteredAgents.filter(a => a.status === 'inactive').length, color: '#F59E0B' }
  ], [filteredAgents]);

  const performanceDistribution = useMemo(() => [
    { name: 'Excellent', value: filteredAgents.filter(a => a.performance === 'excellent').length, color: '#3B82F6' },
    { name: 'Good', value: filteredAgents.filter(a => a.performance === 'good').length, color: '#10B981' },
    { name: 'Average', value: filteredAgents.filter(a => a.performance === 'average').length, color: '#F59E0B' }
  ], [filteredAgents]);

  // Calculate KPIs
  const totalAgents = filteredAgents.length;
  const activeAgents = filteredAgents.filter(a => a.status === 'active').length;
  const totalRoutes = filteredAgents.reduce((sum, agent) => sum + agent.assignedRoutes.length, 0);
  const avgRoutesPerAgent = totalRoutes / Math.max(activeAgents, 1);
  const activeAssignments = Math.floor(totalRoutes * 0.8); // Simulated active assignments
  const avgCollections = performanceData.reduce((sum, p) => sum + p.collections, 0) / Math.max(performanceData.length, 1);
  const targetAchievement = performanceData.reduce((sum, p) => sum + (p.collections / p.target * 100), 0) / Math.max(performanceData.length, 1);

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            {currentProject ? `Project: ${currentProject.name}` : 'All Projects'} | 
            {selectedStates.length > 0 ? ` States: ${selectedStates.join(', ')}` : ' All States'}
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-blue-600">{totalAgents}</p>
                <p className="text-xs text-green-600">↑ {activeAgents} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-green-600">{activeAssignments}</p>
                <p className="text-xs text-blue-600">from {totalRoutes} routes</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Collections</p>
                <p className="text-2xl font-bold text-purple-600">${Math.floor(avgCollections).toLocaleString()}</p>
                <p className="text-xs text-green-600">↑ 12% vs target</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Target Achievement</p>
                <p className="text-2xl font-bold text-orange-600">{Math.floor(targetAchievement)}%</p>
                <p className="text-xs text-green-600">vs {selectedPeriod} target</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Targets vs Actuals Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance vs Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value, name) => [
                  name === 'target' ? `$${value.toLocaleString()} (Target)` : `$${value.toLocaleString()} (Actual)`,
                  name === 'target' ? 'Target' : 'Collections'
                ]} />
                <Bar dataKey="collections" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#F59E0B" radius={[4, 4, 0, 0]} opacity={0.7} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Performance Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {locationData.map((location, index) => (
              <div key={location.location} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{location.location}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{location.agentCount} agents</Badge>
                    <span className="text-sm text-gray-600">
                      ${location.totalCollections.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Progress value={location.avgPerformance} className="h-3" />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{location.avgPerformance}% avg performance</span>
                  <span className={`${location.avgPerformance > 80 ? 'text-green-600' : location.avgPerformance > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {location.avgPerformance > 80 ? 'High' : location.avgPerformance > 60 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends with Targets */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Trends - Collections vs Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyTrendsData}>
                <defs>
                  <linearGradient id="collectionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `$${value.toLocaleString()}`,
                  name === 'target' ? 'Target' : 'Collections'
                ]} />
                <Area type="monotone" dataKey="collections" stroke="#10B981" fillOpacity={1} fill="url(#collectionsGradient)" />
                <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {performanceDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Agent Efficiency Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Efficiency Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData
              .sort((a, b) => b.efficiency - a.efficiency)
              .map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.routes} routes assigned</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${agent.collections.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">vs ${agent.target.toLocaleString()}</span>
                      <Progress value={agent.efficiency} className="w-20 h-2" />
                      <span className="text-sm font-medium">{agent.efficiency}%</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentAnalytics;
