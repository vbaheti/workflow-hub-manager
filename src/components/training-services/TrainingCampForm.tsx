
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trainingTypes } from './TrainingServicesUtils';

interface TrainingCampFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: any[];
  onSubmit: () => void;
}

const TrainingCampForm = ({ open, onOpenChange, agents, onSubmit }: TrainingCampFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Camp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCampForm;
