
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, GraduationCap, Plus, CheckCircle, Clock, MapPin, Calendar, UserCheck } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';

interface TrainingCamp {
  id: string;
  agentId: number;
  agentName: string;
  trainerId: number;
  trainerName: string;
  campName: string;
  location: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  startDate: Date;
  endDate: Date;
  targetCitizens: number;
  registeredCitizens: number;
  completedCitizens: number;
  trainingType: 'skill_development' | 'awareness' | 'capacity_building' | 'livelihood';
  status: 'planned' | 'ongoing' | 'completed' | 'me_pending';
  meCompletedDate?: Date;
  meScore?: number;
  campFeedback?: string;
}

interface TrainingServicesProps {
  agents: any[];
}

const TrainingServices = ({ agents }: TrainingServicesProps) => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  
  const [camps, setCamps] = useState<TrainingCamp[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      trainerId: 101,
      trainerName: 'Dr. Priya Sharma',
      campName: 'Digital Literacy Training',
      location: 'Dharavi Community Center',
      state: 'Maharashtra',
      district: 'Mumbai',
      taluk: 'Mumbai City',
      village: 'Dharavi',
      startDate: new Date('2024-06-10'),
      endDate: new Date('2024-06-15'),
      targetCitizens: 50,
      registeredCitizens: 45,
      completedCitizens: 42,
      trainingType: 'skill_development',
      status: 'me_pending',
      meScore: 85,
      campFeedback: 'Excellent participation and engagement'
    },
    {
      id: '2',
      agentId: 2,
      agentName: 'Priya Sharma',
      trainerId: 102,
      trainerName: 'Prof. Amit Patel',
      campName: 'Health Awareness Program',
      location: 'Govandi Primary School',
      state: 'Maharashtra',
      district: 'Mumbai',
      taluk: 'Mumbai City',
      village: 'Govandi',
      startDate: new Date('2024-06-20'),
      endDate: new Date('2024-06-22'),
      targetCitizens: 75,
      registeredCitizens: 68,
      completedCitizens: 0,
      trainingType: 'awareness',
      status: 'ongoing'
    }
  ]);

  const [showNewCampForm, setShowNewCampForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const trainingTypes = [
    { value: 'skill_development', label: 'Skill Development', color: 'bg-blue-100 text-blue-800' },
    { value: 'awareness', label: 'Awareness Program', color: 'bg-green-100 text-green-800' },
    { value: 'capacity_building', label: 'Capacity Building', color: 'bg-purple-100 text-purple-800' },
    { value: 'livelihood', label: 'Livelihood Training', color: 'bg-orange-100 text-orange-800' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { label: 'Planned', color: 'bg-gray-100 text-gray-800' },
      ongoing: { label: 'Ongoing', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
      me_pending: { label: 'M&E Pending', color: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getCompletionRate = (completed: number, target: number) => {
    return target > 0 ? (completed / target) * 100 : 0;
  };

  const getOverallStats = () => {
    const totalCamps = camps.length;
    const completedCamps = camps.filter(c => c.status === 'completed').length;
    const totalCitizensServed = camps.reduce((sum, c) => sum + c.completedCitizens, 0);
    const avgCompletionRate = camps.length > 0 
      ? camps.reduce((sum, c) => sum + getCompletionRate(c.completedCitizens, c.targetCitizens), 0) / camps.length 
      : 0;

    return { totalCamps, completedCamps, totalCitizensServed, avgCompletionRate };
  };

  const stats = getOverallStats();

  const NewCampForm = () => (
    <Dialog open={showNewCampForm} onOpenChange={setShowNewCampForm}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Training Camp</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Camp Name</Label>
            <Input placeholder="Enter training camp name" />
          </div>
          <div className="space-y-2">
            <Label>Training Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select training type" />
              </SelectTrigger>
              <SelectContent>
                {trainingTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Agent</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Trainer</Label>
            <Input placeholder="Enter trainer name" />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>District</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Taluk</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select taluk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai-city">Mumbai City</SelectItem>
                <SelectItem value="pune-city">Pune City</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Village</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select village" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dharavi">Dharavi</SelectItem>
                <SelectItem value="govandi">Govandi</SelectItem>
                <SelectItem value="kurla">Kurla</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Target Citizens</Label>
            <Input type="number" placeholder="Enter target number" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Location Details</Label>
            <Textarea placeholder="Enter detailed location information" />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowNewCampForm(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast({ title: "Training camp created successfully" });
            setShowNewCampForm(false);
          }}>
            Create Camp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Training Services Management</h3>
          <p className="text-sm text-muted-foreground">Manage training camps, track citizen participation, and monitor M&E completion</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowNewCampForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Training Camp
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Camps</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCamps}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Camps</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedCamps}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citizens Served</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCitizensServed}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgCompletionRate.toFixed(0)}%</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4 items-center">
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Camps</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="me_pending">M&E Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Training Camps Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training Camps & Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Camp Details</TableHead>
                <TableHead>Agent & Trainer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Citizens Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>M&E Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {camps.map((camp) => {
                const completionRate = getCompletionRate(camp.completedCitizens, camp.targetCitizens);
                
                return (
                  <TableRow key={camp.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{camp.campName}</span>
                        <br />
                        <Badge className={trainingTypes.find(t => t.value === camp.trainingType)?.color}>
                          {trainingTypes.find(t => t.value === camp.trainingType)?.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {camp.agentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{camp.agentName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-muted-foreground">{camp.trainerName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{camp.village}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {camp.taluk}, {camp.district}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground">{camp.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{camp.startDate.toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          to {camp.endDate.toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{camp.completedCitizens}/{camp.targetCitizens}</span>
                          <span>{completionRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Registered: {camp.registeredCitizens}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(camp.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {camp.status === 'completed' && camp.meScore ? (
                          <>
                            <Badge className="bg-green-100 text-green-800">
                              M&E Complete
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Score: {camp.meScore}%
                            </div>
                          </>
                        ) : camp.status === 'me_pending' ? (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            M&E Pending
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Not Started
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Details</SelectItem>
                          <SelectItem value="edit">Edit Camp</SelectItem>
                          <SelectItem value="citizens">Manage Citizens</SelectItem>
                          {camp.status === 'completed' && !camp.meScore && (
                            <SelectItem value="me">Complete M&E</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewCampForm />
    </div>
  );
};

export default TrainingServices;
