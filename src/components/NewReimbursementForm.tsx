
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '../contexts/ProjectContext';

interface NewReimbursementFormProps {
  onSubmit: (reimbursement: any) => void;
}

export default function NewReimbursementForm({ onSubmit }: NewReimbursementFormProps) {
  const [open, setOpen] = useState(false);
  const { currentProject, projects } = useProject();
  const [formData, setFormData] = useState({
    employeeName: '',
    project: currentProject?.id || '',
    category: '',
    amount: '',
    description: '',
    receipt: null as File | null
  });
  const { toast } = useToast();

  const getRegionalEmployees = () => {
    const employeesByRegion = {
      'India': ['Arjun Sharma', 'Priya Patel', 'Rajesh Kumar', 'Sneha Reddy', 'Vikram Singh'],
      'South Asia': ['Ahmed Hassan', 'Fatima Khan', 'Rashid Ali', 'Ayesha Begum', 'Imran Sheikh'],
      'South East Asia': ['Lim Wei Ming', 'Siti Nurhaliza', 'Thanh Nguyen', 'Maria Santos', 'Putra Indra'],
      'African Union': ['Kwame Asante', 'Amara Johnson', 'Tendai Mukamuri', 'Aisha Okonkwo', 'Omar El-Rashid']
    };
    
    const selectedProject = projects.find(p => p.id === formData.project);
    if (selectedProject) {
      return employeesByRegion[selectedProject.region as keyof typeof employeesByRegion] || [];
    }
    return [];
  };

  const categories = [
    'Travel & Transportation',
    'Meals & Accommodation',
    'Office Supplies',
    'Training & Development',
    'Equipment & Tools',
    'Communication & Internet',
    'Field Operations',
    'Medical Expenses'
  ];

  const formatCurrency = (amount: string) => {
    const selectedProject = projects.find(p => p.id === formData.project);
    if (selectedProject && amount) {
      return `${selectedProject.currencySymbol}${amount}`;
    }
    return amount;
  };

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

    const selectedProject = projects.find(p => p.id === formData.project);
    const newReimbursement = {
      id: Date.now().toString(),
      employeeName: formData.employeeName,
      project: selectedProject?.name || formData.project,
      projectId: formData.project,
      category: formData.category,
      amount: parseFloat(formData.amount),
      currency: selectedProject?.currency || 'USD',
      currencySymbol: selectedProject?.currencySymbol || '$',
      region: selectedProject?.region || 'Unknown',
      description: formData.description,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      receiptUrl: formData.receipt ? URL.createObjectURL(formData.receipt) : undefined
    };

    onSubmit(newReimbursement);
    setOpen(false);
    setFormData({
      employeeName: '',
      project: currentProject?.id || '',
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
            <Label htmlFor="project">Project *</Label>
            <Select 
              value={formData.project} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.region})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, employeeName: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {getRegionalEmployees().map((employee) => (
                  <SelectItem key={employee} value={employee}>
                    {employee}
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
            <Label htmlFor="amount">
              Amount ({projects.find(p => p.id === formData.project)?.currencySymbol || '$'}) *
            </Label>
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
