
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Employee } from './HRMS';

interface EditEmployeeModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

const departmentList = ['Sales', 'Customer Support', 'Operations'];

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, open, onClose, onSave }) => {
  const [form, setForm] = useState<Employee | null>(employee);

  useEffect(() => {
    setForm(employee);
  }, [employee]);

  if (!employee || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSave(form as Employee);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            required
          />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Department</option>
            {departmentList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <Input
            name="joinDate"
            type="date"
            placeholder="Join Date"
            value={form.joinDate}
            onChange={handleChange}
            required
          />
          <Input
            name="salary"
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
          />
          <Input
            name="leaveBalance"
            type="number"
            placeholder="Leave Balance"
            value={form.leaveBalance}
            onChange={handleChange}
            required
          />
          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
