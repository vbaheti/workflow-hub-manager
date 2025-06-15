
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useApproval } from '../contexts/ApprovalContext';
import { ApprovalType } from '../types/approvals';
import { Permission } from '../types/rbac';

interface ApprovalTriggerProps {
  type: ApprovalType;
  title: string;
  description: string;
  metadata: Record<string, any>;
  requiredPermissions: Permission[];
  priority?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
  onSubmit?: () => void;
  projectId?: string;
}

export default function ApprovalTrigger({
  type,
  title,
  description,
  metadata,
  requiredPermissions,
  priority = 'medium',
  children,
  onSubmit,
  projectId
}: ApprovalTriggerProps) {
  const [open, setOpen] = React.useState(false);
  const [justification, setJustification] = React.useState('');
  const { createApprovalRequest } = useApproval();

  const handleSubmit = () => {
    createApprovalRequest({
      type,
      title,
      description: `${description}\n\nJustification: ${justification}`,
      metadata: {
        ...metadata,
        justification
      },
      priority,
      requiredPermissions,
      projectId,
      requestedBy: 'current-user-id', // This should come from auth context
      requestedByName: 'Current User' // This should come from auth context
    });
    
    setOpen(false);
    setJustification('');
    onSubmit?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
            Approval Required
          </DialogTitle>
          <DialogDescription className="text-sm">
            This action requires approval. Please provide justification for your request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm sm:text-base">{title}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-sm">Justification</Label>
            <Textarea
              id="justification"
              placeholder="Please explain why this action is necessary..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!justification.trim()} className="w-full sm:w-auto">
            Submit for Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
