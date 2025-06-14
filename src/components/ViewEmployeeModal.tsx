
import React from 'react';
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from './HRMS';

interface ViewEmployeeModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

const ViewEmployeeModal: React.FC<ViewEmployeeModalProps> = ({ employee, open, onClose }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Status:</strong> {employee.status}</p>
          <p><strong>Join Date:</strong> {employee.joinDate}</p>
          <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
          <p><strong>Leave Balance:</strong> {employee.leaveBalance} days</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeModal;
