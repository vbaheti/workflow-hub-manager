import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Award, Calendar, GraduationCap } from 'lucide-react';

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
    { name: 'Rajesh Kumar', collections: 45200, routes: 2, efficiency: 92, trainingCamps: 2, citizensTrained: 85 },
    { name: 'Priya Sharma', collections: 52100, routes: 2, efficiency: 95, trainingCamps: 3, citizensTrained: 110 },
    { name: 'Ahmed Hassan', collections: 41800, routes: 2, efficiency: 88, trainingCamps: 1, citizensTrained: 42 },
    { name: 'Fatima Al-Zahra', collections: 38900, routes: 2, efficiency: 85, trainingCamps: 2, citizensTrained: 68 },
    { name: 'Chen Wei Ming', collections: 29500, routes: 1, efficiency: 70, trainingCamps: 1, citizensTrained: 35 }
  ];

  const trainingMetrics = [
    { month: 'Jan', camps: 8, citizens: 420, meCompleted: 6 },
    { month: 'Feb', camps: 10, citizens: 485, meCompleted: 8 },
    { month: 'Mar', camps: 7, citizens: 365, meCompleted: 5 },
    { month: 'Apr', camps: 12, citizens: 580, meCompleted: 10 },
    { month: 'May', camps: 11, citizens: 525, meCompleted: 9 },
    { month: 'Jun', camps: 9, citizens: 450, meCompleted: 7 }
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

  // Training metrics calculations
  const totalTrainingCamps = trainingMetrics.reduce((sum, m) => sum + m.camps, 0);
  const totalCitizensTrained = trainingMetrics.reduce((sum, m) => sum + m.citizens, 0);
  const avgCitizensPerCamp = totalCitizensTrained / totalTrainingCamps;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Training Camps</p>
                <p className="text-2xl font-bold text-orange-600">{totalTrainingCamps}</p>
                <p className="text-xs text-blue-600">6 months total</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citizens Trained</p>
                <p className="text-2xl font-bold text-green-600">{totalCitizensTrained}</p>
                <p className="text-xs text-green-600">≈ {avgCitizensPerCamp.toFixed(0)} per camp</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
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
                <p className="text-lg font-bold text-orange-600">Priya Sharma</p>
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
              Agent Collections & Training Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'collections') return [`$${value.toLocaleString()}`, 'Collections'];
                    if (name === 'citizensTrained') return [`${value}`, 'Citizens Trained'];
                    return [value, name];
                  }} 
                />
                <Bar dataKey="collections" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="citizensTrained" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Monthly Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="camps" stroke="#F97316" strokeWidth={3} name="Training Camps" />
                <Line type="monotone" dataKey="citizens" stroke="#10B981" strokeWidth={3} name="Citizens Trained" />
                <Line type="monotone" dataKey="meCompleted" stroke="#8B5CF6" strokeWidth={3} name="M&E Completed" />
              </LineChart>
            </ResponsiveContainer>
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

      {/* Agent Efficiency Rankings with Training Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Rankings (Overall)</CardTitle>
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
                      <p className="text-sm text-gray-600">{agent.routes} routes • {agent.trainingCamps} camps</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="font-semibold">${agent.collections.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Collections</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-orange-600">{agent.citizensTrained}</p>
                        <p className="text-xs text-gray-500">Citizens Trained</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={agent.efficiency} className="w-20 h-2" />
                      <span className="text-sm font-medium">{agent.efficiency}%</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Camp M&E Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Training Camp M&E Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {trainingMetrics.map((month) => {
              const completionRate = (month.meCompleted / month.camps) * 100;
              return (
                <div key={month.month} className="text-center p-4 border rounded-lg">
                  <p className="font-semibold text-lg">{month.month}</p>
                  <p className="text-2xl font-bold text-orange-600">{month.camps}</p>
                  <p className="text-xs text-gray-500">Camps</p>
                  <Progress value={completionRate} className="mt-2 h-2" />
                  <p className="text-xs mt-1">{month.meCompleted}/{month.camps} M&E Complete</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentAnalytics;
