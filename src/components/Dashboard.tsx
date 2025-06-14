
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, CheckCircle, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

const Dashboard = () => {
  const { currentProject } = useProject();

  // Project-specific data based on region
  const getProjectData = () => {
    if (!currentProject) return null;

    const projectDataMap = {
      'mumbai-financial': {
        currency: '₹',
        stats: [
          { title: "Total Agents", value: "45", change: "+8%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Pending Approvals", value: "12", change: "-3%", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "Monthly Revenue", value: "₹18,45,430", change: "+22%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Completed Tasks", value: "1,247", change: "+25%", icon: CheckCircle, color: "text-purple-600", bgColor: "bg-purple-50" }
        ],
        activities: [
          { agent: "Rajesh Kumar", action: "Commission approved", amount: "₹24,500", time: "2 hours ago", status: "approved" },
          { agent: "Priya Sharma", action: "Reimbursement requested", amount: "₹3,400", time: "4 hours ago", status: "pending" },
          { agent: "Amit Patel", action: "Fee collection completed", amount: "₹12,000", time: "6 hours ago", status: "completed" }
        ]
      },
      'delhi-service': {
        currency: '₹',
        stats: [
          { title: "Total Agents", value: "38", change: "+5%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Pending Approvals", value: "8", change: "-2%", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "Monthly Revenue", value: "₹14,25,680", change: "+18%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Completed Tasks", value: "956", change: "+20%", icon: CheckCircle, color: "text-purple-600", bgColor: "bg-purple-50" }
        ],
        activities: [
          { agent: "Sunita Singh", action: "Commission approved", amount: "₹18,750", time: "1 hour ago", status: "approved" },
          { agent: "Vikram Yadav", action: "Route completed", amount: "₹8,500", time: "3 hours ago", status: "completed" }
        ]
      },
      'singapore-hub': {
        currency: 'S$',
        stats: [
          { title: "Total Agents", value: "28", change: "+12%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Pending Approvals", value: "5", change: "-1%", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "Monthly Revenue", value: "S$125,430", change: "+25%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Completed Tasks", value: "674", change: "+30%", icon: CheckCircle, color: "text-purple-600", bgColor: "bg-purple-50" }
        ],
        activities: [
          { agent: "Chen Wei Ming", action: "Commission approved", amount: "S$4,200", time: "30 min ago", status: "approved" },
          { agent: "Lim Hui Fen", action: "Fee collection", amount: "S$2,800", time: "2 hours ago", status: "completed" }
        ]
      }
    };

    const key = currentProject.id as keyof typeof projectDataMap;
    return projectDataMap[key] || projectDataMap['mumbai-financial'];
  };

  const projectData = getProjectData();

  if (!currentProject || !projectData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Please select a project from the sidebar to view dashboard data.</p>
        </div>
      </div>
    );
  }

  const pendingApprovals = [
    { type: "Commission", agent: "Rajesh Kumar", amount: `${projectData.currency}32,000`, priority: "high" },
    { type: "Reimbursement", agent: "Priya Sharma", amount: `${projectData.currency}6,750`, priority: "medium" },
    { type: "Fee Adjustment", agent: "Amit Patel", amount: `${projectData.currency}11,000`, priority: "low" },
    { type: "Bank Update", agent: "Sunita Singh", amount: "-", priority: "medium" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard - {currentProject.name}</h2>
          <p className="text-muted-foreground">{currentProject.description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projectData.stats.map((stat, index) => (
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
            <CardDescription>Latest agent activities and transactions in {currentProject.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectData.activities.map((activity, index) => (
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
            <CardDescription>Items requiring supervisor approval in {currentProject.name}</CardDescription>
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
          <CardTitle>Performance Overview - {currentProject.name}</CardTitle>
          <CardDescription>Monthly targets and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fee Collection Target</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">{projectData.currency}156,000 / {projectData.currency}200,000</p>
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
