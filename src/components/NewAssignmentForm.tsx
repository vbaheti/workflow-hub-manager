
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

interface Project {
  id: string;
  name: string;
}

interface NewAssignmentFormProps {
  agents: Agent[];
  projects: Project[];
  onAssignmentCreated: (assignment: any) => void;
  onCancel: () => void;
  onConflictCheck: (agentId: number, workload: number) => boolean;
}

const NewAssignmentForm = ({ 
  agents, 
  projects, 
  onAssignmentCreated, 
  onCancel,
  onConflictCheck 
}: NewAssignmentFormProps) => {
  const [formData, setFormData] = useState({
    agentId: '',
    projectId: '',
    role: '',
    workload: 50,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    notes: ''
  });

  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.agentId || !formData.projectId || !formData.role || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check for workload conflicts
    if (onConflictCheck(parseInt(formData.agentId), formData.workload)) {
      toast({
        title: "Assignment Conflict",
        description: "This assignment would exceed the agent's capacity (100%).",
        variant: "destructive"
      });
      return;
    }

    const agent = agents.find(a => a.id === parseInt(formData.agentId));
    const project = projects.find(p => p.id === formData.projectId);

    if (agent && project) {
      const newAssignment = {
        id: Date.now().toString(),
        agentId: agent.id,
        agentName: agent.name,
        projectId: project.id,
        projectName: project.name,
        role: formData.role,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'pending',
        workload: formData.workload,
        notes: formData.notes
      };

      onAssignmentCreated(newAssignment);
      
      toast({
        title: "Assignment Created",
        description: `${agent.name} has been assigned to ${project.name}.`
      });
    }
  };

  const availableRoles = [
    'Agent',
    'Senior Agent', 
    'Team Lead',
    'Specialist',
    'Coordinator'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Create New Assignment</CardTitle>
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
                {agents.filter(agent => agent.status === 'active').map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name} - {agent.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Select Project *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workload">Workload (%) *</Label>
            <Input
              id="workload"
              type="number"
              min="1"
              max="100"
              value={formData.workload}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                workload: parseInt(e.target.value) || 50 
              }))}
              placeholder="50"
            />
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
                  className="p-3 pointer-events-auto"
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
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes or special instructions for this assignment"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Assignment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewAssignmentForm;
