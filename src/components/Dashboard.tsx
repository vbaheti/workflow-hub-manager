
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, CheckCircle, AlertCircle, TrendingUp, Clock, Target, FileText } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

const Dashboard = () => {
  const { currentProject } = useProject();

  // Service-based project data
  const getServiceData = () => {
    if (!currentProject) return null;

    const serviceDataMap = {
      'mumbai-financial': {
        currency: '₹',
        stats: [
          { title: "Active Agents", value: "45", change: "+8%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Service Assignments", value: "132", change: "+15%", icon: Target, color: "text-purple-600", bgColor: "bg-purple-50" },
          { title: "Total Collections", value: "₹28,45,430", change: "+22%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Services Completed", value: "1,247", change: "+25%", icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" }
        ],
        serviceProgress: [
          { 
            service: "Fee Collection", 
            agents: 15, 
            target: 5000000, 
            achieved: 3800000, 
            unit: "amount",
            priority: "high"
          },
          { 
            service: "Document Verification", 
            agents: 12, 
            target: 800, 
            achieved: 650, 
            unit: "documents",
            priority: "medium"
          },
          { 
            service: "Client Onboarding", 
            agents: 8, 
            target: 200, 
            achieved: 145, 
            unit: "clients",
            priority: "high"
          },
          { 
            service: "Compliance Checks", 
            agents: 10, 
            target: 300, 
            achieved: 285, 
            unit: "visits",
            priority: "medium"
          }
        ],
        activities: [
          { agent: "Rajesh Kumar", service: "Fee Collection", amount: "₹24,500", time: "2 hours ago", status: "completed" },
          { agent: "Priya Sharma", service: "Document Verification", amount: "15 docs", time: "4 hours ago", status: "completed" },
          { agent: "Amit Patel", service: "Client Onboarding", amount: "3 clients", time: "6 hours ago", status: "in-progress" }
        ]
      },
      'delhi-service': {
        currency: '₹',
        stats: [
          { title: "Active Agents", value: "38", change: "+5%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Service Assignments", value: "98", change: "+12%", icon: Target, color: "text-purple-600", bgColor: "bg-purple-50" },
          { title: "Total Collections", value: "₹19,25,680", change: "+18%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Services Completed", value: "856", change: "+20%", icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" }
        ],
        serviceProgress: [
          { 
            service: "Fee Collection", 
            agents: 12, 
            target: 3500000, 
            achieved: 2800000, 
            unit: "amount",
            priority: "high"
          },
          { 
            service: "Field Surveys", 
            agents: 15, 
            target: 150, 
            achieved: 125, 
            unit: "visits",
            priority: "medium"
          }
        ],
        activities: [
          { agent: "Sunita Singh", service: "Fee Collection", amount: "₹18,750", time: "1 hour ago", status: "completed" },
          { agent: "Vikram Yadav", service: "Field Survey", amount: "5 visits", time: "3 hours ago", status: "completed" }
        ]
      },
      'singapore-hub': {
        currency: 'S$',
        stats: [
          { title: "Active Agents", value: "28", change: "+12%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Service Assignments", value: "76", change: "+20%", icon: Target, color: "text-purple-600", bgColor: "bg-purple-50" },
          { title: "Total Collections", value: "S$125,430", change: "+25%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Services Completed", value: "574", change: "+30%", icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" }
        ],
        serviceProgress: [
          { 
            service: "Premium Services", 
            agents: 8, 
            target: 150000, 
            achieved: 125000, 
            unit: "amount",
            priority: "high"
          },
          { 
            service: "Compliance Audits", 
            agents: 10, 
            target: 80, 
            achieved: 72, 
            unit: "audits",
            priority: "medium"
          }
        ],
        activities: [
          { agent: "Chen Wei Ming", service: "Premium Services", amount: "S$4,200", time: "30 min ago", status: "completed" },
          { agent: "Lim Hui Fen", service: "Compliance Audit", amount: "2 audits", time: "2 hours ago", status: "completed" }
        ]
      }
    };

    const key = currentProject.id as keyof typeof serviceDataMap;
    return serviceDataMap[key] || serviceDataMap['mumbai-financial'];
  };

  const serviceData = getServiceData();

  if (!currentProject || !serviceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Please select a project from the sidebar to view service dashboard data.</p>
        </div>
      </div>
    );
  }

  const formatValue = (value: number, unit: string, currency: string) => {
    if (unit === 'amount') {
      return `${currency}${value.toLocaleString()}`;
    }
    return `${value} ${unit}`;
  };

  const getProgressColor = (achieved: number, target: number) => {
    const percentage = (achieved / target) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Dashboard - {currentProject.name}</h2>
          <p className="text-muted-foreground">Cumulative service performance and agent targets</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceData.stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Service Performance Overview
            </CardTitle>
            <CardDescription>Cumulative progress across all service assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceData.serviceProgress.map((service, index) => {
                const percentage = (service.achieved / service.target) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{service.service}</span>
                        <Badge variant={service.priority === 'high' ? 'destructive' : 'default'} className="text-xs">
                          {service.agents} agents
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatValue(service.achieved, service.unit, serviceData.currency)}</span>
                      <span>Target: {formatValue(service.target, service.unit, serviceData.currency)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Service Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Service Activities
            </CardTitle>
            <CardDescription>Latest completed services and agent activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceData.activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.agent}</p>
                    <p className="text-xs text-muted-foreground">{activity.service}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{activity.amount}</p>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 
                              activity.status === 'in-progress' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Service Targets Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Service Targets Summary</CardTitle>
          <CardDescription>Overall project performance against service targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Target Achievement</span>
                <span>82%</span>
              </div>
              <Progress value={82} className="h-2" />
              <p className="text-xs text-muted-foreground">Across all services</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Agent Utilization</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">Average capacity usage</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service Quality Score</span>
                <span>88%</span>
              </div>
              <Progress value={88} className="h-2" />
              <p className="text-xs text-muted-foreground">Quality metrics average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
