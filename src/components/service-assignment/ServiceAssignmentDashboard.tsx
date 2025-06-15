
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle, AlertTriangle, GraduationCap, Users } from 'lucide-react';

interface ServiceStats {
  totalAssignments: number;
  onTrackCount: number;
  criticalCount: number;
  trainingAssignments: number;
}

interface ServiceAssignmentDashboardProps {
  stats: ServiceStats;
  activeAgentCount: number;
}

const ServiceAssignmentDashboard = ({ stats, activeAgentCount }: ServiceAssignmentDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalAssignments}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Track</p>
              <p className="text-2xl font-bold text-green-600">{stats.onTrackCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Attention</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Services</p>
              <p className="text-2xl font-bold text-orange-600">{stats.trainingAssignments}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-purple-600">{activeAgentCount}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceAssignmentDashboard;
