
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { MapPin, Plus, Search, Users, Route, Edit, CalendarIcon, Clock, Navigation, CheckCircle, AlertTriangle, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import NewRouteForm from './NewRouteForm';

interface Agent {
  id: number;
  name: string;
  assignedRoutes: string[];
  location: string;
  status: string;
}

interface LocationAssignment {
  id: string;
  village: string;
  startDate: Date;
  endDate: Date;
  actualCheckIn?: Date;
  actualCheckOut?: Date;
  status: 'scheduled' | 'checked-in' | 'completed' | 'missed';
}

interface RouteAssignment {
  id: string;
  agentId: number;
  agentName: string;
  routeName: string;
  state: string;
  district: string;
  taluk: string;
  locationAssignments: LocationAssignment[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  targetVisits: number;
  completedVisits: number;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

interface RouteAssignmentProps {
  agents: Agent[];
}

const locationHierarchy = {
  "Delhi": {
    "Central Delhi": {
      "Connaught Place": ["CP Village", "Metro Colony", "Business District"],
      "Karol Bagh": ["Karol Village", "Market Area", "Residential Zone"],
      "Paharganj": ["Main Bazaar Village", "Hotel District", "Railway Colony"]
    },
    "North Delhi": {
      "Civil Lines": ["Civil Village", "University Area", "Government Colony"],
      "Model Town": ["Model Village", "Shopping Complex", "Metro Station Area"],
      "Kamla Nagar": ["Kamla Village", "Market Complex", "Student Area"]
    },
    "South Delhi": {
      "Greater Kailash": ["GK Village", "M Block Market", "N Block"],
      "Lajpat Nagar": ["Lajpat Village", "Central Market", "Metro Area"],
      "Saket": ["Saket Village", "Mall Area", "Residential Complex"]
    }
  },
  "Maharashtra": {
    "Mumbai": {
      "Bandra": ["Bandra Village", "Linking Road", "Carter Road"],
      "Andheri": ["Andheri Village", "MIDC Area", "Station Road"],
      "Borivali": ["Borivali Village", "National Park Area", "Station Complex"],
      "Thane": ["Thane Village", "Creek Area", "Industrial Zone"]
    },
    "Pune": {
      "Shivaji Nagar": ["Shivaji Village", "JM Road", "Camp Area"],
      "Kothrud": ["Kothrud Village", "University Area", "Market Zone"],
      "Hadapsar": ["Hadapsar Village", "IT Park", "Residential Area"]
    },
    "Nashik": {
      "College Road": ["College Village", "University Area", "Market Zone"],
      "Gangapur Road": ["Gangapur Village", "Industrial Area", "Highway Zone"],
      "Panchavati": ["Panchavati Village", "Temple Area", "Old City"]
    }
  }
};

const RouteAssignment = ({ agents }: RouteAssignmentProps) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [routeName, setRouteName] = useState('');
  const [targetVisits, setTargetVisits] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showNewRouteForm, setShowNewRouteForm] = useState(false);
  const [showMapEntry, setShowMapEntry] = useState(false);
  const [filterState, setFilterState] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [locationAssignments, setLocationAssignments] = useState<LocationAssignment[]>([]);
  
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<RouteAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      routeName: 'Central Delhi Circuit',
      state: 'Delhi',
      district: 'Central Delhi',
      taluk: 'Connaught Place',
      locationAssignments: [
        {
          id: '1',
          village: 'CP Village',
          startDate: new Date('2024-06-15'),
          endDate: new Date('2024-06-15'),
          actualCheckIn: new Date('2024-06-15T09:15:00'),
          actualCheckOut: new Date('2024-06-15T17:30:00'),
          status: 'completed'
        },
        {
          id: '2',
          village: 'Metro Colony',
          startDate: new Date('2024-06-16'),
          endDate: new Date('2024-06-16'),
          actualCheckIn: new Date('2024-06-16T10:00:00'),
          status: 'checked-in'
        }
      ],
      status: 'in-progress',
      targetVisits: 10,
      completedVisits: 7,
      priority: 'high',
      notes: 'Focus on high-priority clients'
    },
    {
      id: '2',
      agentId: 2,
      agentName: 'Priya Sharma',
      routeName: 'Mumbai Financial District',
      state: 'Maharashtra',
      district: 'Mumbai',
      taluk: 'Bandra',
      locationAssignments: [
        {
          id: '3',
          village: 'Bandra Village',
          startDate: new Date('2024-06-17'),
          endDate: new Date('2024-06-17'),
          status: 'scheduled'
        },
        {
          id: '4',
          village: 'Linking Road',
          startDate: new Date('2024-06-17'),
          endDate: new Date('2024-06-18'),
          status: 'scheduled'
        }
      ],
      status: 'scheduled',
      targetVisits: 8,
      completedVisits: 0,
      priority: 'medium',
      notes: 'Client meetings scheduled'
    }
  ]);

  const states = Object.keys(locationHierarchy);
  const districts = selectedState ? Object.keys(locationHierarchy[selectedState as keyof typeof locationHierarchy] || {}) : [];
  const taluks = selectedState && selectedDistrict ? 
    Object.keys(locationHierarchy[selectedState as keyof typeof locationHierarchy]?.[selectedDistrict as keyof typeof locationHierarchy[keyof typeof locationHierarchy]] || {}) : [];
  const villages = selectedState && selectedDistrict && selectedTaluk ?
    locationHierarchy[selectedState as keyof typeof locationHierarchy]?.[selectedDistrict as keyof typeof locationHierarchy[keyof typeof locationHierarchy]]?.[selectedTaluk as keyof typeof locationHierarchy[keyof typeof locationHierarchy][keyof typeof locationHierarchy[keyof typeof locationHierarchy]]] || [] : [];

  const addLocationAssignment = () => {
    const newAssignment: LocationAssignment = {
      id: Date.now().toString(),
      village: '',
      startDate: new Date(),
      endDate: new Date(),
      status: 'scheduled'
    };
    setLocationAssignments([...locationAssignments, newAssignment]);
  };

  const updateLocationAssignment = (id: string, updates: Partial<LocationAssignment>) => {
    setLocationAssignments(locationAssignments.map(assignment => 
      assignment.id === id ? { ...assignment, ...updates } : assignment
    ));
  };

  const removeLocationAssignment = (id: string) => {
    setLocationAssignments(locationAssignments.filter(assignment => assignment.id !== id));
  };

  const handleCreateAssignment = () => {
    if (!selectedAgent || !routeName || locationAssignments.length === 0 || !targetVisits) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one location.",
        variant: "destructive"
      });
      return;
    }

    const incompleteAssignments = locationAssignments.filter(assignment => 
      !assignment.village || !assignment.startDate || !assignment.endDate
    );

    if (incompleteAssignments.length > 0) {
      toast({
        title: "Error",
        description: "Please complete all location assignments.",
        variant: "destructive"
      });
      return;
    }

    const newAssignment: RouteAssignment = {
      id: Date.now().toString(),
      agentId: parseInt(selectedAgent),
      agentName: agents.find(a => a.id === parseInt(selectedAgent))?.name || '',
      routeName,
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk,
      locationAssignments: locationAssignments,
      status: 'scheduled',
      targetVisits: parseInt(targetVisits),
      completedVisits: 0,
      priority,
      notes
    };

    setAssignments([...assignments, newAssignment]);
    
    // Reset form
    setSelectedAgent('');
    setRouteName('');
    setLocationAssignments([]);
    setTargetVisits('');
    setNotes('');
    setPriority('medium');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedTaluk('');

    toast({
      title: "Success",
      description: "Route assignment created successfully.",
    });
  };

  const getProgressPercentage = (completed: number, target: number) => {
    return Math.min((completed / target) * 100, 100);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>,
      'in-progress': <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>,
      completed: <Badge className="bg-green-100 text-green-800">Completed</Badge>,
      overdue: <Badge className="bg-red-100 text-red-800">Overdue</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const getLocationStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'checked-in': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'missed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <MapPin className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesState = filterState === 'all' || assignment.state === filterState;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesState && matchesStatus;
  });

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress').length;
  const overdueAssignments = assignments.filter(a => a.status === 'overdue').length;
  const totalTargetVisits = assignments.reduce((sum, a) => sum + a.targetVisits, 0);
  const totalCompletedVisits = assignments.reduce((sum, a) => sum + a.completedVisits, 0);
  const overallProgress = totalTargetVisits > 0 ? (totalCompletedVisits / totalTargetVisits) * 100 : 0;

  if (showNewRouteForm) {
    return (
      <NewRouteForm
        agents={agents}
        projectId="current-project"
        onRouteCreated={() => setShowNewRouteForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{totalAssignments}</p>
              </div>
              <Route className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{inProgressAssignments}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedAssignments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueAssignments}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-purple-600">{overallProgress.toFixed(0)}%</p>
              </div>
              <Navigation className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {totalCompletedVisits} / {totalTargetVisits} visits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Assignment Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Create Route Assignment</CardTitle>
              <p className="text-muted-foreground mt-2">Assign routes to agents with village-specific scheduling and check-in tracking</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowMapEntry(!showMapEntry)}
              >
                {showMapEntry ? 'Use Form Entry' : 'Use Map Entry'}
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowNewRouteForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Advanced Route Creator
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showMapEntry ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agent *</label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.filter(agent => agent.status === 'active').map(agent => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.name} - {agent.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Route Name *</label>
                  <Input
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="Enter route name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State *</label>
                  <Select value={selectedState} onValueChange={(value) => {
                    setSelectedState(value);
                    setSelectedDistrict('');
                    setSelectedTaluk('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">District *</label>
                  <Select value={selectedDistrict} onValueChange={(value) => {
                    setSelectedDistrict(value);
                    setSelectedTaluk('');
                  }} disabled={!selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Taluk *</label>
                  <Select value={selectedTaluk} onValueChange={setSelectedTaluk} disabled={!selectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select taluk" />
                    </SelectTrigger>
                    <SelectContent>
                      {taluks.map(taluk => (
                        <SelectItem key={taluk} value={taluk}>{taluk}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Assignments */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Village Assignments *</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addLocationAssignment}
                    disabled={!selectedTaluk}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Village
                  </Button>
                </div>

                {locationAssignments.map((assignment) => (
                  <div key={assignment.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Village</label>
                      <Select 
                        value={assignment.village} 
                        onValueChange={(value) => updateLocationAssignment(assignment.id, { village: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select village" />
                        </SelectTrigger>
                        <SelectContent>
                          {villages.map(village => (
                            <SelectItem key={village} value={village}>{village}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {assignment.startDate ? format(assignment.startDate, 'MMM dd') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={assignment.startDate}
                            onSelect={(date) => date && updateLocationAssignment(assignment.id, { startDate: date })}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {assignment.endDate ? format(assignment.endDate, 'MMM dd') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={assignment.endDate}
                            onSelect={(date) => date && updateLocationAssignment(assignment.id, { endDate: date })}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeLocationAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {locationAssignments.length === 0 && selectedTaluk && (
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No villages assigned yet. Click "Add Village" to start.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Visits *</label>
                  <Input
                    type="number"
                    value={targetVisits}
                    onChange={(e) => setTargetVisits(e.target.value)}
                    placeholder="Enter target number of visits"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or instructions"
                  />
                </div>
              </div>

              <Button onClick={handleCreateAssignment} className="w-full">
                Create Route Assignment
              </Button>
            </>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Map Entry Mode</h3>
              <p className="text-gray-600 mb-4">Click on the map to select locations for route assignment</p>
              <Button onClick={() => setShowNewRouteForm(true)}>
                Open Interactive Map
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Assignment Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Route Assignments & Check-in Progress</CardTitle>
            <div className="flex gap-4">
              <Select value={filterState} onValueChange={setFilterState}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Village Assignments</TableHead>
                <TableHead>Check-in Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => {
                const progressPercentage = getProgressPercentage(assignment.completedVisits, assignment.targetVisits);
                const completedLocations = assignment.locationAssignments.filter(loc => loc.status === 'completed').length;
                const totalLocations = assignment.locationAssignments.length;
                
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {assignment.agentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{assignment.agentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{assignment.routeName}</span>
                        <p className="text-xs text-gray-500">{assignment.state} → {assignment.district} → {assignment.taluk}</p>
                        {assignment.notes && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">{assignment.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{totalLocations} Villages</div>
                        <div className="space-y-1">
                          {assignment.locationAssignments.slice(0, 2).map((location) => (
                            <div key={location.id} className="flex items-center space-x-2">
                              {getLocationStatusIcon(location.status)}
                              <span className="text-xs">{location.village}</span>
                              <span className="text-xs text-gray-500">
                                {format(location.startDate, 'MMM dd')}
                                {location.startDate.getTime() !== location.endDate.getTime() && 
                                  ` - ${format(location.endDate, 'MMM dd')}`
                                }
                              </span>
                            </div>
                          ))}
                          {totalLocations > 2 && (
                            <div className="text-xs text-gray-500">+{totalLocations - 2} more villages</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">{completedLocations}/{totalLocations} completed</div>
                          {completedLocations === totalLocations && totalLocations > 0 && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${totalLocations > 0 ? (completedLocations / totalLocations) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {assignment.locationAssignments
                            .filter(loc => loc.actualCheckIn)
                            .map(loc => `${loc.village}: ${format(loc.actualCheckIn!, 'HH:mm')}`)
                            .slice(0, 1)
                            .join(', ')}
                          {assignment.locationAssignments.filter(loc => loc.actualCheckIn).length > 1 && '...'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{assignment.completedVisits}/{assignment.targetVisits}</span>
                          <span>{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              progressPercentage >= 90 ? 'bg-green-500' : 
                              progressPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteAssignment;
