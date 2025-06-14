
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, CheckCircle, AlertTriangle, DollarSign, TrendingUp, Calendar, User } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

interface ServiceDelivery {
  id: string;
  agentName: string;
  serviceType: string;
  clientName: string;
  location: string;
  scheduledTime: string;
  actualTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  revenue: number;
  expenses: number;
  netRevenue: number;
  duration: number;
  distance: number;
  customerRating: number;
  notes: string;
}

const ServiceDeliveryTracking = () => {
  const { currentProject } = useProject();
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  // Sample service delivery data
  const serviceDeliveries: ServiceDelivery[] = [
    {
      id: 'SVC001',
      agentName: 'Priya Sharma',
      serviceType: 'Document Collection',
      clientName: 'Raj Electronics',
      location: 'Bandra West, Mumbai',
      scheduledTime: '09:00 AM',
      actualTime: '09:15 AM',
      status: 'completed',
      revenue: 850,
      expenses: 150,
      netRevenue: 700,
      duration: 45,
      distance: 3.2,
      customerRating: 4.8,
      notes: 'All documents collected successfully'
    },
    {
      id: 'SVC002',
      agentName: 'Chen Wei Ming',
      serviceType: 'Payment Collection',
      clientName: 'Marina Bay Trading',
      location: 'Marina Bay, Singapore',
      scheduledTime: '11:00 AM',
      actualTime: '11:00 AM',
      status: 'in-progress',
      revenue: 1200,
      expenses: 200,
      netRevenue: 1000,
      duration: 0,
      distance: 2.8,
      customerRating: 0,
      notes: 'Payment collection in progress'
    },
    {
      id: 'SVC003',
      agentName: 'Ahmed Hassan',
      serviceType: 'Document Delivery',
      clientName: 'Dhaka Traders Ltd',
      location: 'Gulshan, Dhaka',
      scheduledTime: '02:00 PM',
      actualTime: '02:30 PM',
      status: 'delayed',
      revenue: 600,
      expenses: 100,
      netRevenue: 500,
      duration: 0,
      distance: 4.5,
      customerRating: 0,
      notes: 'Traffic delay on route'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'scheduled': { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'delayed': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'cancelled': { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCurrency = () => {
    if (!currentProject) return '₹';
    const currencyMap: { [key: string]: string } = {
      'mumbai-financial': '₹',
      'delhi-service': '₹',
      'bangalore-tech': '₹',
      'singapore-hub': 'S$',
      'dhaka-urban': '৳',
      'lagos-commercial': '₦',
      'nairobi-services': 'KSh',
      'cape-town-network': 'R'
    };
    return currencyMap[currentProject.id] || '₹';
  };

  const totalRevenue = serviceDeliveries.reduce((sum, service) => sum + service.revenue, 0);
  const totalExpenses = serviceDeliveries.reduce((sum, service) => sum + service.expenses, 0);
  const netRevenue = totalRevenue - totalExpenses;
  const completedServices = serviceDeliveries.filter(s => s.status === 'completed').length;
  const averageRating = serviceDeliveries
    .filter(s => s.customerRating > 0)
    .reduce((sum, s) => sum + s.customerRating, 0) / 
    serviceDeliveries.filter(s => s.customerRating > 0).length || 0;

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Please select a project to view service delivery tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Delivery & Revenue Tracking</h2>
          <p className="text-muted-foreground">{currentProject.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant={selectedTimeframe === 'today' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('today')}>
            Today
          </Button>
          <Button variant={selectedTimeframe === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('week')}>
            This Week
          </Button>
          <Button variant={selectedTimeframe === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTimeframe('month')}>
            This Month
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrency()}{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrency()}{netRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedServices}</div>
            <p className="text-xs text-muted-foreground">Out of {serviceDeliveries.length} scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Service Deliveries</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Deliveries</CardTitle>
              <CardDescription>Real-time tracking of service deliveries and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceDeliveries.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.id}</TableCell>
                      <TableCell>{service.agentName}</TableCell>
                      <TableCell>{service.serviceType}</TableCell>
                      <TableCell>{service.clientName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{service.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Scheduled: {service.scheduledTime}</div>
                          {service.actualTime && service.actualTime !== service.scheduledTime && (
                            <div className="text-muted-foreground">Actual: {service.actualTime}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell className="font-semibold">{getCurrency()}{service.revenue}</TableCell>
                      <TableCell>
                        {service.customerRating > 0 ? (
                          <span>★ {service.customerRating}</span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-semibold">{getCurrency()}{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-semibold text-red-600">-{getCurrency()}{totalExpenses.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Revenue</span>
                    <span className="text-green-600">{getCurrency()}{netRevenue.toLocaleString()}</span>
                  </div>
                  <Progress value={(netRevenue / totalRevenue) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Profit margin: {((netRevenue / totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Type Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Collection</span>
                    <span className="font-semibold">{getCurrency()}1,200</span>
                  </div>
                  <Progress value={48} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Collection</span>
                    <span className="font-semibold">{getCurrency()}850</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Delivery</span>
                    <span className="font-semibold">{getCurrency()}600</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Priya Sharma', 'Chen Wei Ming', 'Ahmed Hassan'].map((agent, index) => (
                    <div key={agent} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{agent}</span>
                        <span className="text-sm">{[100, 90, 75][index]}% completion rate</span>
                      </div>
                      <Progress value={[100, 90, 75][index]} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>On-time Delivery Rate</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span>Average Service Duration</span>
                    <span className="font-semibold">32 minutes</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-semibold">4.6/5.0</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceDeliveryTracking;
