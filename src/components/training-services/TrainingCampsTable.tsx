
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
              <TableHead>Agent & Trainer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Citizens Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>M&E Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {camps.map((camp) => {
              const completionRate = getCompletionRate(camp.completedCitizens, camp.targetCitizens);
              const statusConfig = getStatusBadgeConfig(camp.status);
              
              return (
                <TableRow key={camp.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="font-medium">{camp.campName}</span>
                      <br />
                      <Badge className={trainingTypes.find(t => t.value === camp.trainingType)?.color}>
                        {trainingTypes.find(t => t.value === camp.trainingType)?.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {camp.agentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{camp.agentName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">{camp.trainerName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{camp.village}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {camp.taluk}, {camp.district}
                      </span>
                      <br />
                      <span className="text-xs text-muted-foreground">{camp.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{camp.startDate.toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        to {camp.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{camp.completedCitizens}/{camp.targetCitizens}</span>
                        <span>{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Registered: {camp.registeredCitizens}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {camp.status === 'completed' && camp.meScore ? (
                        <>
                          <Badge className="bg-green-100 text-green-800">
                            M&E Complete
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Score: {camp.meScore}%
                          </div>
                        </>
                      ) : camp.status === 'me_pending' ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          M&E Pending
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Not Started
                        </Badge>
                      )}
                    </div>
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
                        {camp.status === 'completed' && !camp.meScore && (
                          <SelectItem value="me">Complete M&E</SelectItem>
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

export default TrainingCampsTable;
