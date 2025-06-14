
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewReimbursementFormProps {
  onSubmit: (reimbursement: any) => void;
}

export default function NewReimbursementForm({ onSubmit }: NewReimbursementFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    project: '',
    category: '',
    amount: '',
    description: '',
    receipt: null as File | null
  });
  const { toast } = useToast();

  const projects = [
    'Project Alpha',
    'Project Beta',
    'Project Gamma',
    'Project Delta',
    'Project Epsilon'
  ];

  const categories = [
    'Travel',
    'Meals',
    'Office Supplies',
    'Training',
    'Equipment',
    'Communication',
    'Accommodation'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeName || !formData.project || !formData.category || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newReimbursement = {
      id: Date.now().toString(),
      employeeName: formData.employeeName,
      project: formData.project,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      receiptUrl: formData.receipt ? URL.createObjectURL(formData.receipt) : undefined
    };

    onSubmit(newReimbursement);
    setOpen(false);
    setFormData({
      employeeName: '',
      project: '',
      category: '',
      amount: '',
      description: '',
      receipt: null
    });

    toast({
      title: "Success",
      description: "Reimbursement request submitted successfully.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, receipt: file }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Reimbursement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit New Reimbursement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name *</Label>
            <Input
              id="employeeName"
              value={formData.employeeName}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter expense description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('receipt')?.click()}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{formData.receipt ? formData.receipt.name : 'Upload Receipt'}</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
