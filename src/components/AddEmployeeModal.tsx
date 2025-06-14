
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: any) => void;
}

const defaultFormState = {
  name: '',
  email: '',
  position: '',
  department: '',
  status: 'active',
  joinDate: '',
  salary: 0,
  leaveBalance: 0
};

const departmentList = ['Sales', 'Customer Support', 'Operations'];

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState(defaultFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Simple validation
    if (!form.name || !form.email) return;
    onAdd(form);
    setForm(defaultFormState);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => { e.preventDefault(); handleSubmit(); }}
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Employee
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
