
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewPerformanceModalProps {
  agent: any;
  open: boolean;
  onClose: () => void;
}

const ViewPerformanceModal: React.FC<ViewPerformanceModalProps> = ({ agent, open, onClose }) => {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Performance: {agent.name}</DialogTitle>
        </DialogHeader>
        <div>
          <p>(Agent performance data and charts will appear here.)</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPerformanceModal;
