
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, GraduationCap, TrendingUp, UserCheck } from 'lucide-react';
import { TrainingStats } from './TrainingServicesUtils';

interface TrainingServicesDashboardProps {
  stats: TrainingStats;
}

const TrainingServicesDashboard = ({ stats }: TrainingServicesDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Target Camps</p>
              <p className="text-2xl font-bold text-orange-600">{stats.targetCamps}</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actual Camps</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCamps}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Camps Achievement</p>
              <p className="text-2xl font-bold text-green-600">{stats.campsAchievementRate.toFixed(0)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Target Citizens</p>
              <p className="text-2xl font-bold text-orange-600">{stats.targetCitizens}</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citizens Served</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalCitizensServed}</p>
            </div>
            <UserCheck className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citizens Achievement</p>
              <p className="text-2xl font-bold text-green-600">{stats.citizensAchievementRate.toFixed(0)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingServicesDashboard;
