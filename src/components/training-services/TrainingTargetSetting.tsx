
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Target, Edit, Save, X } from 'lucide-react';
import { TrainingTarget } from './TrainingServicesUtils';

interface TrainingTargetSettingProps {
  targets: TrainingTarget[];
  agents: any[];
  onUpdateTarget: (target: TrainingTarget) => void;
}

const TrainingTargetSetting = ({ targets, agents, onUpdateTarget }: TrainingTargetSettingProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TrainingTarget>>({});

  const handleEdit = (target: TrainingTarget) => {
    setEditingId(target.id);
    setEditForm(target);
  };

  const handleSave = () => {
    if (editForm && editingId) {
      onUpdateTarget(editForm as TrainingTarget);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Training Targets Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Target Camps</TableHead>
                <TableHead>Target Citizens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((target) => (
                <TableRow key={target.id}>
                  <TableCell className="font-medium">{target.agentName}</TableCell>
                  <TableCell>
                    {editingId === target.id ? (
                      <Input
                        value={editForm.period || ''}
                        onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                        className="w-24"
                      />
                    ) : (
                      target.period
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === target.id ? (
                      <Input
                        type="number"
                        value={editForm.targetCamps || 0}
                        onChange={(e) => setEditForm({ ...editForm, targetCamps: Number(e.target.value) })}
                        className="w-20"
                      />
                    ) : (
                      target.targetCamps
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === target.id ? (
                      <Input
                        type="number"
                        value={editForm.targetCitizens || 0}
                        onChange={(e) => setEditForm({ ...editForm, targetCitizens: Number(e.target.value) })}
                        className="w-20"
                      />
                    ) : (
                      target.targetCitizens
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      target.actualCamps >= target.targetCamps && target.actualCitizens >= target.targetCitizens 
                        ? "default" 
                        : "secondary"
                    }>
                      {target.actualCamps >= target.targetCamps && target.actualCitizens >= target.targetCitizens 
                        ? "Achieved" 
                        : "In Progress"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === target.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(target)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingTargetSetting;
