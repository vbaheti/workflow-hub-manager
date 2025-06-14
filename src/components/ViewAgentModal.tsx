
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewAgentModalProps {
  agent: any;
  open: boolean;
  onClose: () => void;
}

const ViewAgentModal: React.FC<ViewAgentModalProps> = ({ agent, open, onClose }) => {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agent Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Name:</strong> {agent.name}</p>
          <p><strong>Email:</strong> {agent.email}</p>
          <p><strong>Phone:</strong> {agent.phone}</p>
          <p><strong>Location:</strong> {agent.location}</p>
          <p><strong>Status:</strong> {agent.status}</p>
          <p><strong>Performance:</strong> {agent.performance}</p>
          <p><strong>Join Date:</strong> {agent.joinDate}</p>
          <p><strong>Assigned Routes:</strong> {(agent.assignedRoutes || []).join(", ")}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAgentModal;
