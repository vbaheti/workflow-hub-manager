
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Plus, MapPin, Trash2, Clock, Map } from 'lucide-react';
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
  coordinates?: { lat: number; lng: number };
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
  onConflictCheck?: (agentId: number, startTime: string, endTime: string, date: Date) => boolean;
}

const NewRouteForm = ({ agents, projectId, onRouteCreated, onConflictCheck }: NewRouteFormProps) => {
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

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [mapApiKey, setMapApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (mapApiKey && mapRef.current) {
      loadGoogleMapsScript();
    }
  }, [mapApiKey]);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}&libraries=places`;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
      zoom: 13,
    });

    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      draggable: true,
    });

    directionsRendererRef.current.setMap(googleMapRef.current);

    // Add click listener to add stops
    googleMapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        addStopFromMap(event.latLng);
      }
    });
  };

  const addStopFromMap = async (latLng: google.maps.LatLng) => {
    const geocoder = new google.maps.Geocoder();
    
    try {
      const response = await geocoder.geocode({ location: latLng });
      if (response.results[0]) {
        const address = response.results[0].formatted_address;
        
        const stop: Stop = {
          id: Date.now().toString(),
          address,
          expectedTime: '09:00',
          duration: 30,
          priority: 'medium',
          notes: '',
          coordinates: {
            lat: latLng.lat(),
            lng: latLng.lng()
          }
        };

        setStops(prev => [...prev, stop]);
        updateRouteDisplay();
        
        toast({
          title: "Stop Added",
          description: `Added stop at ${address}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not get address for this location",
        variant: "destructive"
      });
    }
  };

  const updateRouteDisplay = () => {
    if (!directionsServiceRef.current || !directionsRendererRef.current || stops.length < 2) {
      return;
    }

    const waypoints = stops.slice(1, -1).map(stop => ({
      location: stop.coordinates ? 
        new google.maps.LatLng(stop.coordinates.lat, stop.coordinates.lng) : 
        stop.address,
      stopover: true,
    }));

    const request: google.maps.DirectionsRequest = {
      origin: stops[0].coordinates ? 
        new google.maps.LatLng(stops[0].coordinates.lat, stops[0].coordinates.lng) : 
        stops[0].address,
      destination: stops[stops.length - 1].coordinates ? 
        new google.maps.LatLng(stops[stops.length - 1].coordinates.lat, stops[stops.length - 1].coordinates.lng) : 
        stops[stops.length - 1].address,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsServiceRef.current.route(request, (result, status) => {
      if (status === 'OK' && result) {
        directionsRendererRef.current?.setDirections(result);
      }
    });
  };

  useEffect(() => {
    updateRouteDisplay();
  }, [stops]);

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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateString = format(date, 'yyyy-MM-dd');
    const exists = selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateString);
    
    if (exists) {
      setSelectedDates(selectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateString));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSubmit = () => {
    if (!formData.routeName || !formData.agentId || selectedDates.length === 0 || stops.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields, select at least one date, and add at least one stop.",
        variant: "destructive"
      });
      return;
    }

    // Check for conflicts if onConflictCheck is provided
    if (onConflictCheck) {
      for (const date of selectedDates) {
        const hasConflict = onConflictCheck(
          parseInt(formData.agentId), 
          '09:00',
          '17:00', 
          date
        );
        
        if (hasConflict) {
          toast({
            title: "Schedule Conflict",
            description: `Conflict detected for ${format(date, 'PPP')}`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    console.log('Creating route:', {
      ...formData,
      projectId,
      stops,
      selectedDates
    });

    toast({
      title: "Success",
      description: `Route created for ${selectedDates.length} date(s).`,
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

  if (showApiKeyInput) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Google Maps Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google Maps API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={mapApiKey}
              onChange={(e) => setMapApiKey(e.target.value)}
              placeholder="Enter your Google Maps API key"
            />
          </div>
          <Button 
            onClick={() => {
              if (mapApiKey) {
                setShowApiKeyInput(false);
              } else {
                toast({
                  title: "Error",
                  description: "Please enter a valid API key",
                  variant: "destructive"
                });
              }
            }}
            className="w-full"
          >
            Continue
          </Button>
          <p className="text-xs text-muted-foreground">
            Get your API key from the Google Cloud Console and enable the Maps JavaScript API and Places API.
          </p>
        </CardContent>
      </Card>
    );
  }

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
          </div>

          <div className="space-y-2">
            <Label>Select Multiple Dates *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.length === 0 ? (
                    <span>Select dates</span>
                  ) : (
                    <span>{selectedDates.length} date(s) selected</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {selectedDates.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDates.map((date, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {format(date, 'MMM dd, yyyy')}
                    <button
                      onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Interactive Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click on the map to add stops to your route. The route will be automatically calculated and displayed.
            </p>
            <div 
              ref={mapRef} 
              className="w-full h-96 border rounded-lg"
              style={{ minHeight: '400px' }}
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
                  <TableHead>Order</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stops.map((stop, index) => (
                  <TableRow key={stop.id}>
                    <TableCell>
                      <Badge variant="outline">{index + 1}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="truncate max-w-xs">{stop.address}</span>
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
                    <TableCell className="truncate max-w-xs">{stop.notes || '-'}</TableCell>
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
          Create Route for {selectedDates.length} Date(s)
        </Button>
      </div>
    </div>
  );
};

export default NewRouteForm;
