
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, MapPin, Plus, Clock, Navigation, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  location: string;
}

interface RouteAssignment {
  id: string;
  agentId: number;
  agentName: string;
  routeName: string;
  visitDate: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  coordinates: { lat: number; lng: number; address: string }[];
  notes: string;
}

interface TimeBoundRouteAssignmentProps {
  agents: Agent[];
  projectId: string;
}

const TimeBoundRouteAssignment = ({ agents, projectId }: TimeBoundRouteAssignmentProps) => {
  const [assignments, setAssignments] = useState<RouteAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'John Smith',
      routeName: 'Manhattan District A',
      visitDate: new Date('2024-06-15'),
      startTime: '09:00',
      endTime: '17:00',
      status: 'scheduled',
      coordinates: [
        { lat: 40.7580, lng: -73.9855, address: '350 5th Ave, New York, NY 10118' },
        { lat: 40.7614, lng: -73.9776, address: '11 W 42nd St, New York, NY 10036' },
        { lat: 40.7505, lng: -73.9934, address: '1 Wall St, New York, NY 10005' }
      ],
      notes: 'Focus on high-priority clients'
    },
    {
      id: '2',
      agentId: 2,
      agentName: 'Sarah Johnson',
      routeName: 'Hollywood District B',
      visitDate: new Date('2024-06-16'),
      startTime: '08:30',
      endTime: '16:30',
      status: 'in-progress',
      coordinates: [
        { lat: 34.0928, lng: -118.3287, address: '6801 Hollywood Blvd, Los Angeles, CA 90028' },
        { lat: 34.1016, lng: -118.3416, address: '1750 N Highland Ave, Los Angeles, CA 90028' }
      ],
      notes: 'Client meetings scheduled'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    agentId: '',
    routeName: '',
    startTime: '',
    endTime: '',
    notes: ''
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>,
      'in-progress': <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>,
      completed: <Badge className="bg-green-100 text-green-800">Completed</Badge>,
      cancelled: <Badge variant="secondary">Cancelled</Badge>
    };
    return variants[status as keyof typeof variants];
  };

  const handleCreateAssignment = () => {
    if (!formData.agentId || !formData.routeName || !selectedDate || !formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedAgent = agents.find(a => a.id.toString() === formData.agentId);
    const newAssignment: RouteAssignment = {
      id: Date.now().toString(),
      agentId: parseInt(formData.agentId),
      agentName: selectedAgent?.name || '',
      routeName: formData.routeName,
      visitDate: selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: 'scheduled',
      coordinates: [],
      notes: formData.notes
    };

    setAssignments([...assignments, newAssignment]);
    setIsDialogOpen(false);
    setFormData({ agentId: '', routeName: '', startTime: '', endTime: '', notes: '' });
    setSelectedDate(undefined);

    toast({
      title: "Success",
      description: "Route assignment created successfully.",
    });
  };

  const filteredAssignments = assignments.filter(assignment => 
    agents.some(agent => agent.id === assignment.agentId)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Time-bound Route Assignments</h3>
          <p className="text-sm text-muted-foreground">Schedule agent visits with specific dates and times</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Route Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent">Agent *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, agentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name} - {agent.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name *</Label>
                <Input
                  id="routeName"
                  value={formData.routeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, routeName: e.target.value }))}
                  placeholder="Enter route name"
                />
              </div>

              <div className="space-y-2">
                <Label>Visit Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or instructions"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssignment}>
                  Schedule Route
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
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
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-blue-600" />
                      <span>{assignment.routeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{format(assignment.visitDate, "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{assignment.startTime} - {assignment.endTime}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{assignment.coordinates.length} locations</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{assignment.notes || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default TimeBoundRouteAssignment;
