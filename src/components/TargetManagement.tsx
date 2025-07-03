
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, TrendingUp, Users, Calendar, Plus } from 'lucide-react';
import { useTargets } from '@/hooks/useTargets';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';

const TargetManagement = () => {
  const { currentProject } = useProject();
  const { profile } = useAuth();
  const { targets, loading, createTarget, error } = useTargets(currentProject?.id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    metric_type: 'revenue' as const,
    target_value: 0,
    period_start: '',
    period_end: ''
  });

  const handleCreateTarget = async () => {
    if (!currentProject || !profile) return;

    const result = await createTarget({
      ...formData,
      project_id: currentProject.id,
      current_progress: 0,
      assigned_to_id: profile.id,
      parent_target_id: null,
      status: 'active'
    });

    if (result.data) {
      setShowCreateModal(false);
      setFormData({
        name: '',
        metric_type: 'revenue',
        target_value: 0,
        period_start: '',
        period_end: ''
      });
    }
  };

  const getMetricIcon = (metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return <TrendingUp className="h-4 w-4" />;
      case 'services_completed':
        return <Target className="h-4 w-4" />;
      case 'training_camps':
        return <Users className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      'on_hold': 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="p-6">Loading targets...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error loading targets: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Target Management</h3>
          <p className="text-sm text-muted-foreground">Set and track targets for {currentProject?.name}</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Set Target
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Target</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="target-name">Target Name</Label>
                <Input
                  id="target-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Q1 Revenue Target"
                />
              </div>
              <div>
                <Label htmlFor="metric-type">Metric Type</Label>
                <Select 
                  value={formData.metric_type} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, metric_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="services_completed">Services Completed</SelectItem>
                    <SelectItem value="fee_collection">Fee Collection</SelectItem>
                    <SelectItem value="training_camps">Training Camps</SelectItem>
                    <SelectItem value="citizens_trained">Citizens Trained</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target-value">Target Value</Label>
                <Input
                  id="target-value"
                  type="number"
                  value={formData.target_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_value: Number(e.target.value) }))}
                  placeholder="100000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="period-start">Start Date</Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={formData.period_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, period_start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="period-end">End Date</Label>
                  <Input
                    id="period-end"
                    type="date"
                    value={formData.period_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, period_end: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleCreateTarget} className="w-full">
                Create Target
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Targets Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Targets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targets.filter(t => t.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently being tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targets.filter(t => t.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground">Successfully achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {targets.length > 0 
                ? Math.round(targets.reduce((acc, t) => acc + (t.current_progress / t.target_value * 100), 0) / targets.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Across all targets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {targets.filter(t => {
                const endDate = new Date(t.period_end);
                const now = new Date();
                return endDate.getMonth() === now.getMonth() && endDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Ending soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Targets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Targets Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {targets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No targets found. Create your first target to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target Name</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targets.map((target) => (
                  <TableRow key={target.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(target.metric_type)}
                        <span className="font-medium">{target.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {target.metric_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{target.current_progress.toLocaleString()}</span>
                          <span>{target.target_value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((target.current_progress / target.target_value) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((target.current_progress / target.target_value) * 100)}% complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(target.period_start).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">to {new Date(target.period_end).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(target.status)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Split Target
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TargetManagement;
