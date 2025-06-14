
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Plus, MapPin, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Stop {
  id: string;
  address: string;
  expectedTime: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

interface Agent {
  id: number;
  name: string;
  location: string;
}

interface NewRouteFormProps {
  agents: Agent[];
  projectId: string;
  onRouteCreated: () => void;
}

const NewRouteForm = ({ agents, projectId, onRouteCreated }: NewRouteFormProps) => {
  const [formData, setFormData] = useState({
    routeName: '',
    agentId: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: ''
  });
  
  const [stops, setStops] = useState<Stop[]>([]);
  const [newStop, setNewStop] = useState({
    address: '',
    expectedTime: '',
    duration: 30,
    priority: 'medium' as const,
    notes: ''
  });

  const { toast } = useToast();

  const addStop = () => {
    if (!newStop.address || !newStop.expectedTime) {
      toast({
        title: "Error",
        description: "Please fill in address and expected time for the stop.",
        variant: "destructive"
      });
      return;
    }

    const stop: Stop = {
      id: Date.now().toString(),
      ...newStop
    };

    setStops([...stops, stop]);
    setNewStop({
      address: '',
      expectedTime: '',
      duration: 30,
      priority: 'medium',
      notes: ''
    });
  };

  const removeStop = (stopId: string) => {
    setStops(stops.filter(stop => stop.id !== stopId));
  };

  const handleSubmit = () => {
    if (!formData.routeName || !formData.agentId || !formData.startDate || !formData.endDate || stops.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one stop.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the route to your backend
    console.log('Creating route:', {
      ...formData,
      projectId,
      stops
    });

    toast({
      title: "Success",
      description: "Route created successfully.",
    });

    onRouteCreated();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Route Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="agent">Assign to Agent *</Label>
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
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Route description or special instructions"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Stops</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={newStop.address}
                onChange={(e) => setNewStop(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter stop address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedTime">Expected Time *</Label>
              <Input
                id="expectedTime"
                type="time"
                value={newStop.expectedTime}
                onChange={(e) => setNewStop(prev => ({ ...prev, expectedTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newStop.duration}
                onChange={(e) => setNewStop(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={newStop.priority} onValueChange={(value: any) => setNewStop(prev => ({ ...prev, priority: value }))}>
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

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={newStop.notes}
              onChange={(e) => setNewStop(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes for this stop"
            />
          </div>

          <Button onClick={addStop} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Stop
          </Button>

          {stops.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stops.map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{stop.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{stop.expectedTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stop.duration} min</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(stop.priority)}>
                        {stop.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{stop.notes || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeStop(stop.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onRouteCreated}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Create Route
        </Button>
      </div>
    </div>
  );
};

export default NewRouteForm;
