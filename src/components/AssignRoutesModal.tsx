
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AssignRoutesModalProps {
  agent: any;
  open: boolean;
  onClose: () => void;
}

const AssignRoutesModal: React.FC<AssignRoutesModalProps> = ({ agent, open, onClose }) => {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Routes to {agent.name}</DialogTitle>
        </DialogHeader>
        <div>
          <p>(Route assignment UI will be implemented here.)</p>
          <p>Current Routes: <strong>{(agent.assignedRoutes || []).join(", ")}</strong></p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoutesModal;
