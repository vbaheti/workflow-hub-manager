
export interface ServiceAssignment {
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

export interface AvailableService {
  type: string;
  name: string;
  unit: string;
  description: string;
}

export interface BadgeConfig {
  variant: 'default' | 'secondary' | 'destructive';
  className: string;
  text: string;
}

export const getProgressPercentage = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

export const getProgressBadgeConfig = (current: number, target: number): BadgeConfig => {
  const percentage = getProgressPercentage(current, target);
  if (percentage >= 90) return { variant: 'default', className: 'bg-green-100 text-green-800', text: 'On Track' };
  if (percentage >= 70) return { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800', text: 'Behind' };
  return { variant: 'destructive', className: 'bg-red-100 text-red-800', text: 'Critical' };
};

export const formatValue = (value: number, unit: string): string => {
  if (unit === 'amount') {
    return `₹${value.toLocaleString()}`;
  }
  return `${value} ${unit}`;
};

export const getServiceStats = (assignments: ServiceAssignment[]) => {
  const totalAssignments = assignments.length;
  const onTrackCount = assignments.filter(a => getProgressPercentage(a.currentProgress, a.monthlyTarget) >= 90).length;
  const criticalCount = assignments.filter(a => getProgressPercentage(a.currentProgress, a.monthlyTarget) < 70).length;
  const trainingAssignments = assignments.filter(a => a.serviceType === 'training_camps' || a.serviceType === 'training_citizens').length;
  
  return { totalAssignments, onTrackCount, criticalCount, trainingAssignments };
};

export const getServiceTypeStats = (assignments: ServiceAssignment[], availableServices: AvailableService[]) => {
  const serviceTypeStats = availableServices.map(service => {
    const serviceAssignments = assignments.filter(a => a.serviceType === service.type);
    const totalTarget = serviceAssignments.reduce((sum, a) => sum + a.monthlyTarget, 0);
    const totalProgress = serviceAssignments.reduce((sum, a) => sum + a.currentProgress, 0);
    const progressPercentage = totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
    
    return {
      serviceType: service.type,
      serviceName: service.name,
      unit: service.unit,
      assignmentCount: serviceAssignments.length,
      totalTarget,
      totalProgress,
      progressPercentage,
      activeAgents: new Set(serviceAssignments.map(a => a.agentId)).size
    };
  }).filter(stat => stat.assignmentCount > 0);
  
  return serviceTypeStats;
};
