
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  name: string;
  location: string;
  status: string;
}

interface Service {
  type: string;
  name: string;
  unit: string;
  description: string;
}

interface NewServiceAssignmentFormProps {
  agents: Agent[];
  services: Service[];
  projectId: string;
  onAssignmentCreated: (assignment: any) => void;
  onCancel: () => void;
}

const NewServiceAssignmentForm = ({ 
  agents, 
  services, 
  projectId,
  onAssignmentCreated, 
  onCancel
}: NewServiceAssignmentFormProps) => {
  const [formData, setFormData] = useState({
    agentId: '',
    serviceType: '',
    serviceName: '',
    monthlyTarget: '',
    targetUnit: '',
    priority: 'medium',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    notes: ''
  });

  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.agentId || !formData.serviceType || !formData.monthlyTarget || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const agent = agents.find(a => a.id === parseInt(formData.agentId));
    const service = services.find(s => s.type === formData.serviceType);

    if (agent && service) {
      const newAssignment = {
        id: Date.now().toString(),
        agentId: agent.id,
        agentName: agent.name,
        projectId,
        serviceName: formData.serviceName || service.name,
        serviceType: service.type,
        monthlyTarget: parseInt(formData.monthlyTarget),
        currentProgress: 0,
        targetUnit: service.unit,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'active',
        priority: formData.priority
      };

      onAssignmentCreated(newAssignment);
      
      toast({
        title: "Service Assigned",
        description: `${service.name} has been assigned to ${agent.name}.`
      });
    }
  };

  const selectedService = services.find(s => s.type === formData.serviceType);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Assign Service to Agent</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="agent">Select Agent *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, agentId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose agent" />
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
            <Label htmlFor="service">Select Service *</Label>
            <Select onValueChange={(value) => {
              const service = services.find(s => s.type === value);
              setFormData(prev => ({ 
                ...prev, 
                serviceType: value,
                targetUnit: service?.unit || ''
              }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.type} value={service.type}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceName">Custom Service Name (Optional)</Label>
            <Input
              id="serviceName"
              value={formData.serviceName}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
              placeholder={selectedService?.name || "Enter custom name"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Monthly Target *</Label>
            <div className="flex space-x-2">
              <Input
                id="target"
                type="number"
                value={formData.monthlyTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyTarget: e.target.value }))}
                placeholder="100"
                className="flex-1"
              />
              <div className="flex items-center px-3 border rounded-md bg-gray-50">
                <span className="text-sm text-gray-600">
                  {selectedService?.unit || 'units'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
            <Label>End Date (Optional)</Label>
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

        {selectedService && (
          <div className="p-4 border rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">{selectedService.name}</h4>
            <p className="text-sm text-blue-700">{selectedService.description}</p>
            <p className="text-sm text-blue-600 mt-1">
              Target unit: <span className="font-medium">{selectedService.unit}</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes or special instructions for this service assignment"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Assign Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewServiceAssignmentForm;
