
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { TrainingCamp, trainingTypes, getStatusBadgeConfig, getCompletionRate } from './TrainingServicesUtils';

interface TrainingCampsTableProps {
  camps: TrainingCamp[];
}

const TrainingCampsTable = ({ camps }: TrainingCampsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Camps & Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camp Details</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Citizens Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {camps.map((camp) => {
              const completionRate = getCompletionRate(0, camp.target_citizens || 0); // Using 0 as completed since it's not in schema
              const statusConfig = getStatusBadgeConfig(camp.status);
              
              return (
                <TableRow key={camp.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="font-medium">{camp.camp_name}</span>
                      <br />
                      <Badge className="bg-blue-100 text-blue-800">
                        Training Camp
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            A{camp.agent_id}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">Agent {camp.agent_id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{camp.location || 'N/A'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{new Date(camp.start_date).toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        to {new Date(camp.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>0/{camp.target_citizens || 0}</span>
                        <span>{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Target: {camp.target_citizens || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
                      {statusConfig?.label || camp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Details</SelectItem>
                        <SelectItem value="edit">Edit Camp</SelectItem>
                        <SelectItem value="citizens">Manage Citizens</SelectItem>
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

export default TrainingCampsTable;
