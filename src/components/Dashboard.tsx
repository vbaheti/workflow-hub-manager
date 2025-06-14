
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, CheckCircle, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import ProjectSelector from './ProjectSelector';
import { useProject } from '../contexts/ProjectContext';

const Dashboard = () => {
  const { selectedProject, setSelectedProject, projects, currentProject } = useProject();

  const getRegionalAgentNames = (region: string) => {
    const names = {
      'India': ['Arjun Sharma', 'Priya Patel', 'Rajesh Kumar', 'Sneha Reddy', 'Vikram Singh'],
      'South Asia': ['Ahmed Hassan', 'Fatima Khan', 'Rashid Ali', 'Ayesha Begum', 'Imran Sheikh'],
      'South East Asia': ['Lim Wei Ming', 'Siti Nurhaliza', 'Thanh Nguyen', 'Maria Santos', 'Putra Indra'],
      'African Union': ['Kwame Asante', 'Amara Johnson', 'Tendai Mukamuri', 'Aisha Okonkwo', 'Omar El-Rashid']
    };
    return names[region as keyof typeof names] || names['India'];
  };

  const formatCurrency = (amount: number) => {
    if (!currentProject) return `$${amount.toLocaleString()}`;
    return `${currentProject.currencySymbol}${amount.toLocaleString()}`;
  };

  const stats = [
    {
      title: "Active Agents",
      value: currentProject?.agentCount?.toString() || "0",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Approvals",
      value: "18",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(125430),
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Completed Routes",
      value: currentProject?.routeCount?.toString() || "0",
      change: "+23%",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const agentNames = currentProject ? getRegionalAgentNames(currentProject.region) : [];
  
  const recentActivities = [
    { agent: agentNames[0], action: "Commission approved", amount: formatCurrency(2450), time: "2 hours ago", status: "approved" },
    { agent: agentNames[1], action: "Reimbursement requested", amount: formatCurrency(340), time: "4 hours ago", status: "pending" },
    { agent: agentNames[2], action: "Fee collection completed", amount: formatCurrency(1200), time: "6 hours ago", status: "completed" },
    { agent: agentNames[3], action: "Bank details updated", amount: "-", time: "1 day ago", status: "completed" },
    { agent: agentNames[4], action: "Commission requested", amount: formatCurrency(890), time: "1 day ago", status: "pending" }
  ];

  const pendingApprovals = [
    { type: "Commission", agent: agentNames[0], amount: formatCurrency(3200), priority: "high" },
    { type: "Reimbursement", agent: agentNames[1], amount: formatCurrency(675), priority: "medium" },
    { type: "Fee Adjustment", agent: agentNames[2], amount: formatCurrency(1100), priority: "low" },
    { type: "Bank Update", agent: agentNames[3], amount: "-", priority: "medium" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Agent Portal Dashboard</h2>
          <p className="text-muted-foreground">Service Management System</p>
        </div>
        <div className="w-80">
          <ProjectSelector
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
            projects={projects}
          />
        </div>
      </div>

      {currentProject && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{currentProject.name}</h3>
                <p className="text-sm text-muted-foreground">{currentProject.region} • {currentProject.description}</p>
              </div>
              <Badge className={
                currentProject.status === 'active' ? 'bg-green-100 text-green-800' :
                currentProject.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {currentProject.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest agent activities and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.agent}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{activity.amount}</p>
                    <Badge 
                      variant={activity.status === 'approved' ? 'default' : 
                              activity.status === 'pending' ? 'secondary' : 'outline'}
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

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items requiring supervisor approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{approval.type}</p>
                    <p className="text-xs text-muted-foreground">{approval.agent}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-sm">{approval.amount}</p>
                    <Badge 
                      variant={approval.priority === 'high' ? 'destructive' : 
                              approval.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {approval.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Monthly targets and achievements for {currentProject?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fee Collection Target</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">{formatCurrency(156000)} / {formatCurrency(200000)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Commission Processing</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">460 / 500 processed</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Agent Satisfaction</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">4.2 / 5.0 rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
