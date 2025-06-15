
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap } from 'lucide-react';

interface ServiceAssignment {
  id: string;
  agentId: number;
  agentName: string;
  projectId: string;
  serviceName: string;
  serviceType: 'fee_collection' | 'document_verification' | 'client_onboarding' | 'compliance_check' | 'field_survey' | 'training_camps' | 'training_citizens';
  monthlyTarget: number;
  currentProgress: number;
  targetUnit: 'clients' | 'amount' | 'documents' | 'visits' | 'camps' | 'citizens';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

interface ServiceAssignmentTableProps {
  assignments: ServiceAssignment[];
  getProgressPercentage: (current: number, target: number) => number;
  getProgressBadgeConfig: (current: number, target: number) => { variant: 'default' | 'secondary' | 'destructive'; className: string; text: string };
  formatValue: (value: number, unit: string) => string;
}

const ServiceAssignmentTable = ({ 
  assignments, 
  getProgressPercentage, 
  getProgressBadgeConfig, 
  formatValue 
}: ServiceAssignmentTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Assignments & Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => {
              const progressPercentage = getProgressPercentage(assignment.currentProgress, assignment.monthlyTarget);
              const badgeConfig = getProgressBadgeConfig(assignment.currentProgress, assignment.monthlyTarget);
              const isTrainingService = assignment.serviceType === 'training_camps' || assignment.serviceType === 'training_citizens';
              
              return (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {assignment.agentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{assignment.agentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isTrainingService && <GraduationCap className="h-4 w-4 text-orange-600" />}
                        <span className="font-medium">{assignment.serviceName}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatValue(assignment.monthlyTarget, assignment.targetUnit)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{formatValue(assignment.currentProgress, assignment.targetUnit)}</span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            progressPercentage >= 90 ? 'bg-green-500' : 
                            progressPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
                      {badgeConfig.text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="edit">Edit Target</SelectItem>
                        <SelectItem value="pause">Pause</SelectItem>
                        <SelectItem value="reassign">Reassign</SelectItem>
                        {isTrainingService && (
                          <SelectItem value="view-camps">View Camps</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceAssignmentTable;
