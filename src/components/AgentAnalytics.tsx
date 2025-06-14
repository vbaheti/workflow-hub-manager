
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Award, Calendar } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  assignedRoutes: string[];
  location: string;
  status: string;
  performance: string;
  totalCollections: string;
}

interface AgentAnalyticsProps {
  agents: Agent[];
}

const AgentAnalytics = ({ agents }: AgentAnalyticsProps) => {
  const performanceData = [
    { name: 'John Smith', collections: 45200, routes: 2, efficiency: 92 },
    { name: 'Emily Chen', collections: 52100, routes: 2, efficiency: 95 },
    { name: 'Robert Wilson', collections: 41800, routes: 2, efficiency: 88 },
    { name: 'Sarah Johnson', collections: 38900, routes: 2, efficiency: 85 },
    { name: 'Mike Davis', collections: 29500, routes: 1, efficiency: 70 }
  ];

  const routeCoverageData = [
    { city: 'New York', covered: 3, total: 4, percentage: 75 },
    { city: 'Los Angeles', covered: 2, total: 2, percentage: 100 },
    { city: 'San Francisco', covered: 2, total: 2, percentage: 100 },
    { city: 'Chicago', covered: 1, total: 1, percentage: 100 },
    { city: 'Miami', covered: 2, total: 2, percentage: 100 }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', collections: 185000, agents: 5 },
    { month: 'Feb', collections: 195000, agents: 5 },
    { month: 'Mar', collections: 178000, agents: 5 },
    { month: 'Apr', collections: 208000, agents: 5 },
    { month: 'May', collections: 215000, agents: 5 },
    { month: 'Jun', collections: 207000, agents: 5 }
  ];

  const statusDistribution = [
    { name: 'Active', value: agents.filter(a => a.status === 'active').length, color: '#10B981' },
    { name: 'Inactive', value: agents.filter(a => a.status === 'inactive').length, color: '#F59E0B' }
  ];

  const performanceDistribution = [
    { name: 'Excellent', value: agents.filter(a => a.performance === 'excellent').length, color: '#3B82F6' },
    { name: 'Good', value: agents.filter(a => a.performance === 'good').length, color: '#10B981' },
    { name: 'Average', value: agents.filter(a => a.performance === 'average').length, color: '#F59E0B' }
  ];

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalRoutes = agents.reduce((sum, agent) => sum + agent.assignedRoutes.length, 0);
  const avgRoutesPerAgent = totalRoutes / activeAgents;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-green-600">{totalRoutes}</p>
                <p className="text-xs text-blue-600">≈ {avgRoutesPerAgent.toFixed(1)} per agent</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Collections</p>
                <p className="text-2xl font-bold text-purple-600">$41,500</p>
                <p className="text-xs text-green-600">↑ 12% vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-lg font-bold text-orange-600">Emily Chen</p>
                <p className="text-xs text-green-600">95% efficiency</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Agent Collections Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Collections']} />
                <Bar dataKey="collections" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Coverage Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Coverage by City
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {routeCoverageData.map((city) => (
              <div key={city.city} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{city.city}</span>
                  <span className="text-sm text-gray-600">
                    {city.covered}/{city.total} routes
                  </span>
                </div>
                <Progress value={city.percentage} className="h-2" />
                <div className="text-xs text-gray-500">
                  {city.percentage}% coverage
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Collections Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Collections Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Collections']} />
                <Line type="monotone" dataKey="collections" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
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

      {/* Agent Efficiency Rankings */}
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
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
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
