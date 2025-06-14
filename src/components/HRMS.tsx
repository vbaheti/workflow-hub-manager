
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Calendar, Clock, Search, Filter, Eye, Edit } from 'lucide-react';
import ProjectSelector from './ProjectSelector';
import { useProject } from '../contexts/ProjectContext';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  salary: number;
  leaveBalance: number;
  projectIds: string[];
  region: string;
}

export default function HRMS() {
  const { currentProject, projects, selectedProject, setSelectedProject } = useProject();
  
  const getRegionalEmployees = (): Employee[] => {
    const allEmployees: Employee[] = [
      // India employees
      {
        id: '1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@company.com',
        position: 'Senior Service Agent',
        department: 'Field Operations',
        status: 'active',
        joinDate: '2022-03-15',
        salary: 850000,
        leaveBalance: 15,
        projectIds: ['project-mumbai', 'project-delhi'],
        region: 'India'
      },
      {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@company.com',
        position: 'Service Agent',
        department: 'Customer Support',
        status: 'active',
        joinDate: '2023-01-20',
        salary: 620000,
        leaveBalance: 12,
        projectIds: ['project-mumbai'],
        region: 'India'
      },
      {
        id: '3',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@company.com',
        position: 'Team Lead',
        department: 'Operations',
        status: 'on-leave',
        joinDate: '2021-08-10',
        salary: 950000,
        leaveBalance: 8,
        projectIds: ['project-delhi'],
        region: 'India'
      },
      // South Asia employees
      {
        id: '4',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@company.com',
        position: 'Senior Service Agent',
        department: 'Field Operations',
        status: 'active',
        joinDate: '2022-06-15',
        salary: 45000,
        leaveBalance: 18,
        projectIds: ['project-dhaka'],
        region: 'South Asia'
      },
      {
        id: '5',
        name: 'Fatima Khan',
        email: 'fatima.khan@company.com',
        position: 'Service Agent',
        department: 'Customer Support',
        status: 'active',
        joinDate: '2023-02-10',
        salary: 38000,
        leaveBalance: 14,
        projectIds: ['project-dhaka'],
        region: 'South Asia'
      },
      // South East Asia employees
      {
        id: '6',
        name: 'Lim Wei Ming',
        email: 'wei.ming@company.com',
        position: 'Senior Service Agent',
        department: 'Field Operations',
        status: 'active',
        joinDate: '2022-01-15',
        salary: 65000,
        leaveBalance: 20,
        projectIds: ['project-singapore'],
        region: 'South East Asia'
      },
      {
        id: '7',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@company.com',
        position: 'Service Agent',
        department: 'Customer Support',
        status: 'active',
        joinDate: '2023-03-20',
        salary: 48000,
        leaveBalance: 16,
        projectIds: ['project-kuala-lumpur'],
        region: 'South East Asia'
      },
      // African Union employees
      {
        id: '8',
        name: 'Kwame Asante',
        email: 'kwame.asante@company.com',
        position: 'Senior Service Agent',
        department: 'Field Operations',
        status: 'active',
        joinDate: '2022-04-15',
        salary: 42000,
        leaveBalance: 22,
        projectIds: ['project-lagos'],
        region: 'African Union'
      },
      {
        id: '9',
        name: 'Amara Johnson',
        email: 'amara.johnson@company.com',
        position: 'Team Lead',
        department: 'Operations',
        status: 'active',
        joinDate: '2021-11-10',
        salary: 55000,
        leaveBalance: 19,
        projectIds: ['project-johannesburg'],
        region: 'African Union'
      }
    ];

    return allEmployees.filter(employee => 
      employee.projectIds.includes(selectedProject)
    );
  };

  const [employees, setEmployees] = useState<Employee[]>(getRegionalEmployees());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Update employees when project changes
  React.useEffect(() => {
    setEmployees(getRegionalEmployees());
  }, [selectedProject]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    if (!currentProject) return `$${amount.toLocaleString()}`;
    return `${currentProject.currencySymbol}${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'on-leave').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Resource Management</h1>
          <p className="text-gray-600 mt-2">Manage employee information, attendance, and leave requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-80">
            <ProjectSelector
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              projects={projects}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
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
              <Badge className="bg-blue-100 text-blue-800">
                {employees.length} employees
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">{onLeaveEmployees}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Field Operations">Field Operations</SelectItem>
                <SelectItem value="Customer Support">Customer Support</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-gray-600">{employee.position}</p>
                  <p className="text-sm text-gray-500">{employee.department}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm"><span className="font-medium">Email:</span> {employee.email}</p>
                <p className="text-sm"><span className="font-medium">Join Date:</span> {employee.joinDate}</p>
                <p className="text-sm"><span className="font-medium">Salary:</span> {formatCurrency(employee.salary)}</p>
                <p className="text-sm"><span className="font-medium">Leave Balance:</span> {employee.leaveBalance} days</p>
                <p className="text-sm"><span className="font-medium">Region:</span> {employee.region}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or change the selected project.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
