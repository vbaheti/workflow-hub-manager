
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Agent, RouteAssignment } from "@/types";
import { allRoutes } from "@/data/routes";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isSameDay } from 'date-fns';
import { useToast } from "./ui/use-toast";

interface AssignRoutesModalProps {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
  assignments: RouteAssignment[];
  handleCreateAssignment: (assignment: Omit<RouteAssignment, 'id'>) => boolean;
}

const AssignRoutesModal: React.FC<AssignRoutesModalProps> = ({ agent, open, onClose, assignments, handleCreateAssignment }) => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setSelectedRoute("");
      setVisitDate(undefined);
      setStartTime("");
      setEndTime("");
      setNotes("");
    }
  }, [open]);

  if (!agent) return null;
  
  const agentAssignmentsToday = visitDate ? assignments.filter(a => a.agentId === agent?.id && isSameDay(a.visitDate, visitDate)) : [];

  const handleSubmit = () => {
    if (!selectedRoute || !visitDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to create an assignment.",
        variant: "destructive",
      });
      return;
    }
    
    const success = handleCreateAssignment({
      agentId: agent.id,
      agentName: agent.name,
      routeName: selectedRoute,
      visitDate,
      startTime,
      endTime,
      status: 'scheduled',
      coordinates: [],
      notes,
      plannedStops: 0,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Assign Route to {agent.name}</DialogTitle>
          <DialogDescription>Schedule a new time-bound route. The system will check for scheduling conflicts.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8 py-4">
            <div className="space-y-4">
                <h4 className="font-semibold text-md mb-2">New Assignment</h4>
                <div className="space-y-2">
                    <Label htmlFor="route">Route</Label>
                    <Select onValueChange={setSelectedRoute} value={selectedRoute}>
                        <SelectTrigger id="route">
                            <SelectValue placeholder="Select a route" />
                        </SelectTrigger>
                        <SelectContent>
                            {allRoutes.map(route => (
                                <SelectItem key={route.id} value={route.name}>{route.name} ({route.city})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Visit Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !visitDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {visitDate ? format(visitDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={visitDate}
                            onSelect={setVisitDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Add any notes for the agent..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-md mb-2">Agent's Schedule</h4>
                {visitDate ? (
                     <div>
                        <p className="text-sm font-medium mb-2">Assignments for {format(visitDate, "PPP")}:</p>
                        {agentAssignmentsToday.length > 0 ? (
                            <ul className="space-y-2 rounded-md border p-3">
                                {agentAssignmentsToday.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(a => (
                                    <li key={a.id} className="text-sm flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground"/> 
                                        <span><strong>{a.startTime} - {a.endTime}</strong>: {a.routeName}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-center text-muted-foreground border p-4 rounded-md">No assignments for this day.</div>
                        )}
                     </div>
                ) : (
                    <div className="text-sm text-center text-muted-foreground border p-4 rounded-md">Select a date to view the agent's schedule.</div>
                )}
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoutesModal;
