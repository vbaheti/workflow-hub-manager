
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Globe, Building2, Plus, Users, DollarSign, Target, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '../contexts/RBACContext';
import PermissionGate from '../components/PermissionGate';

// Project Management Components
const ProjectManagement = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Mumbai Financial Services', lead: 'John Doe', status: 'active', budget: 500000, agents: 25 },
    { id: 2, name: 'Delhi Service Hub', lead: 'Jane Smith', status: 'active', budget: 350000, agents: 18 },
  ]);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    budget: '',
    geography: '',
    projectLead: '',
    services: [],
    targets: {}
  });

  const [showAddProject, setShowAddProject] = useState(false);
  const { toast } = useToast();

  const masterServices = [
    { id: 'AADHAAR_NEW', name: 'Aadhaar New Registration', baseRate: 25 },
    { id: 'PAN_NEW', name: 'PAN Card New', baseRate: 107 },
    { id: 'PASSPORT_NEW', name: 'Passport New', baseRate: 500 },
    { id: 'DL_NEW', name: 'Driving License New', baseRate: 200 },
    { id: 'VOTER_NEW', name: 'Voter ID New', baseRate: 25 },
  ];

  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      toast({ title: "Error", description: "Project name is required", variant: "destructive" });
      return;
    }
    
    const project = {
      id: projects.length + 1,
      name: newProject.name,
      lead: newProject.projectLead,
      status: 'active',
      budget: parseInt(newProject.budget) || 0,
      agents: 0
    };
    
    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', budget: '', geography: '', projectLead: '', services: [], targets: {} });
    setShowAddProject(false);
    
    toast({ title: "Success", description: "Project created successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Project Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage projects with service allocation</p>
        </div>
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Set up a new project with services, targets, and team structure</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Project Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Project Lead</label>
                    <Select onValueChange={(value) => setNewProject({...newProject, projectLead: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project lead" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith</SelectItem>
                        <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Project description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Budget (₹)</label>
                    <Input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                      placeholder="Enter budget"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Geography</label>
                    <Input
                      value={newProject.geography}
                      onChange={(e) => setNewProject({...newProject, geography: e.target.value})}
                      placeholder="States/regions to be covered"
                    />
                  </div>
                </div>
              </div>

              {/* Service Allocation */}
              <div className="space-y-4">
                <h4 className="font-medium">Service Allocation</h4>
                <div className="border rounded-lg p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Base Rate (₹)</TableHead>
                        <TableHead>Project Rate (₹)</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Include</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {masterServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.baseRate}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={service.baseRate}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="Target"
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Switch />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Team Hierarchy */}
              <div className="space-y-4">
                <h4 className="font-medium">Team Hierarchy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">AVP</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AVP" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avp1">AVP - Operations</SelectItem>
                        <SelectItem value="avp2">AVP - Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Senior Manager</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Senior Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm1">Senior Manager - North</SelectItem>
                        <SelectItem value="sm2">Senior Manager - South</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddProject(false)}>Cancel</Button>
                <Button onClick={handleAddProject}>Create Project</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Projects</CardTitle>
          <CardDescription>Manage your active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Project Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.lead}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{project.budget.toLocaleString()}</TableCell>
                  <TableCell>{project.agents}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// P&L Management Component
const PnLManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  
  const pnlData = {
    revenue: {
      serviceRevenue: 2500000,
      commissionIncome: 125000,
      otherIncome: 25000,
      total: 2650000
    },
    expenses: {
      humanResources: 1200000,
      capex: 300000,
      opex: 450000,
      reimbursements: 75000,
      other: 100000,
      total: 2125000
    },
    netProfit: 525000
  };

  const verticals = [
    { name: 'Financial Services', revenue: 1200000, expenses: 800000, profit: 400000 },
    { name: 'Document Services', revenue: 800000, expenses: 600000, profit: 200000 },
    { name: 'Training Services', revenue: 400000, expenses: 350000, profit: 50000 },
    { name: 'Consulting', revenue: 250000, expenses: 175000, profit: 75000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">P&L Management</h3>
          <p className="text-sm text-muted-foreground">Track profitability across verticals and projects</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall P&L Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pnlData.revenue.total.toLocaleString()}</div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span>Service Revenue</span>
                <span>₹{pnlData.revenue.serviceRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Commission Income</span>
                <span>₹{pnlData.revenue.commissionIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Other Income</span>
                <span>₹{pnlData.revenue.otherIncome.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pnlData.expenses.total.toLocaleString()}</div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span>Human Resources</span>
                <span>₹{pnlData.expenses.humanResources.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>CAPEX</span>
                <span>₹{pnlData.expenses.capex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>OPEX</span>
                <span>₹{pnlData.expenses.opex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Reimbursements</span>
                <span>₹{pnlData.expenses.reimbursements.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pnlData.netProfit.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-2">
              Margin: {((pnlData.netProfit / pnlData.revenue.total) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vertical-wise P&L */}
      <Card>
        <CardHeader>
          <CardTitle>Vertical-wise P&L</CardTitle>
          <CardDescription>Profitability breakdown by business vertical</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vertical</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Margin %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verticals.map((vertical) => (
                <TableRow key={vertical.name}>
                  <TableCell className="font-medium">{vertical.name}</TableCell>
                  <TableCell>₹{vertical.revenue.toLocaleString()}</TableCell>
                  <TableCell>₹{vertical.expenses.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-green-600">₹{vertical.profit.toLocaleString()}</TableCell>
                  <TableCell>{((vertical.profit / vertical.revenue) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPEX Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Equipment & Technology</span>
                <span>₹150,000</span>
              </div>
              <div className="flex justify-between">
                <span>Infrastructure</span>
                <span>₹100,000</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicles</span>
                <span>₹50,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OPEX Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Office Rent</span>
                <span>₹200,000</span>
              </div>
              <div className="flex justify-between">
                <span>Utilities</span>
                <span>₹50,000</span>
              </div>
              <div className="flex justify-between">
                <span>Marketing</span>
                <span>₹100,000</span>
              </div>
              <div className="flex justify-between">
                <span>Other Operating</span>
                <span>₹100,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Settings Page Component
const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoApproval, setAutoApproval] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { toast } = useToast();
  const { hasPermission } = useRBAC();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your system preferences and configurations</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className={`grid w-full ${hasPermission('manage_settings') ? 'grid-cols-5' : 'grid-cols-3'}`}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {hasPermission('manage_settings') && (
            <>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="pnl">P&L</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input defaultValue="System Administrator" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input defaultValue="admin@company.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Select defaultValue="administration">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administration">Administration</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                </div>
                <Button variant="outline" className="mt-2">Update Password</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {hasPermission('manage_settings') && (
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Super Admin - Project Management
                </CardTitle>
                <CardDescription>Create and manage projects with service allocation and team hierarchy</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {hasPermission('manage_settings') && (
          <TabsContent value="pnl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  P&L Management
                </CardTitle>
                <CardDescription>Track profitability and financial performance across verticals</CardDescription>
              </CardHeader>
              <CardContent>
                <PnLManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
