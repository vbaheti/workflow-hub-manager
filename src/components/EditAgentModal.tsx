
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditAgentModalProps {
  agent: any;
  open: boolean;
  onClose: () => void;
}

const EditAgentModal: React.FC<EditAgentModalProps> = ({ agent, open, onClose }) => {
  if (!agent) return null;

  // For now, just placeholder — to be expanded with forms.
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Agent (Placeholder)</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>Editing agent: <strong>{agent.name}</strong></p>
          <p>(Form fields for agent editing go here.)</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentModal;
