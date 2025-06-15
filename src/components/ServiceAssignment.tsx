import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertTriangle } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import NewServiceAssignmentForm from './NewServiceAssignmentForm';
import ServiceAssignmentDashboard from './service-assignment/ServiceAssignmentDashboard';
import ServiceTypeOverview from './service-assignment/ServiceTypeOverview';
import ServiceAssignmentTable from './service-assignment/ServiceAssignmentTable';
import { 
  getProgressPercentage, 
  getProgressBadge, 
  formatValue, 
  getServiceStats, 
  getServiceTypeStats 
} from './service-assignment/ServiceAssignmentUtils';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  location: string;
  status: string;
}

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

interface ServiceAssignmentProps {
  agents: Agent[];
}

const ServiceAssignment = ({ agents }: ServiceAssignmentProps) => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([
    {
      id: '1',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'mumbai-fin',
      serviceName: 'Premium Client Fee Collection',
      serviceType: 'fee_collection',
      monthlyTarget: 500000,
      currentProgress: 380000,
      targetUnit: 'amount',
      startDate: new Date('2024-01-15'),
      status: 'active',
      priority: 'high'
    },
    {
      id: '2',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'mumbai-fin',
      serviceName: 'Document Verification',
      serviceType: 'document_verification',
      monthlyTarget: 100,
      currentProgress: 75,
      targetUnit: 'documents',
      startDate: new Date('2024-01-15'),
      status: 'active',
      priority: 'medium'
    },
    {
      id: '3',
      agentId: 2,
      agentName: 'Priya Sharma',
      projectId: 'mumbai-fin',
      serviceName: 'New Client Onboarding',
      serviceType: 'client_onboarding',
      monthlyTarget: 25,
      currentProgress: 18,
      targetUnit: 'clients',
      startDate: new Date('2024-02-01'),
      status: 'active',
      priority: 'high'
    },
    {
      id: '4',
      agentId: 1,
      agentName: 'Rajesh Kumar',
      projectId: 'mumbai-fin',
      serviceName: 'Monthly Training Camps',
      serviceType: 'training_camps',
      monthlyTarget: 3,
      currentProgress: 2,
      targetUnit: 'camps',
      startDate: new Date('2024-06-01'),
      status: 'active',
      priority: 'high'
    },
    {
      id: '5',
      agentId: 2,
      agentName: 'Priya Sharma',
      projectId: 'mumbai-fin',
      serviceName: 'Citizens Training Target',
      serviceType: 'training_citizens',
      monthlyTarget: 150,
      currentProgress: 110,
      targetUnit: 'citizens',
      startDate: new Date('2024-06-01'),
      status: 'active',
      priority: 'medium'
    }
  ]);

  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);

  const availableServices = [
    { 
      type: 'fee_collection', 
      name: 'Fee Collection', 
      unit: 'amount',
      description: 'Collect fees from clients'
    },
    { 
      type: 'document_verification', 
      name: 'Document Verification', 
      unit: 'documents',
      description: 'Verify client documents'
    },
    { 
      type: 'client_onboarding', 
      name: 'Client Onboarding', 
      unit: 'clients',
      description: 'Onboard new clients'
    },
    { 
      type: 'compliance_check', 
      name: 'Compliance Check', 
      unit: 'visits',
      description: 'Conduct compliance visits'
    },
    { 
      type: 'field_survey', 
      name: 'Field Survey', 
      unit: 'visits',
      description: 'Conduct field surveys'
    },
    { 
      type: 'training_camps', 
      name: 'Training Camps', 
      unit: 'camps',
      description: 'Organize and conduct training camps'
    },
    { 
      type: 'training_citizens', 
      name: 'Citizens Training', 
      unit: 'citizens',
      description: 'Train citizens in various programs'
    }
  ];

  const handleNewAssignment = (newAssignment: any) => {
    setAssignments([...assignments, newAssignment]);
    setShowNewAssignmentForm(false);
  };

  const filteredAgents = agents.filter(agent => agent.status === 'active');
  const stats = getServiceStats(assignments);
  const serviceTypeStats = getServiceTypeStats(assignments, availableServices);

  if (showNewAssignmentForm) {
    return (
      <NewServiceAssignmentForm
        agents={filteredAgents}
        services={availableServices}
        projectId={currentProject?.id || ''}
        onAssignmentCreated={handleNewAssignment}
        onCancel={() => setShowNewAssignmentForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Service Assignment & Targets</h3>
          <p className="text-sm text-muted-foreground">Assign specific services to agents with performance targets, including training camps</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewAssignmentForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Assign Service
        </Button>
      </div>

      <ServiceAssignmentDashboard 
        stats={stats} 
        activeAgentsCount={filteredAgents.length} 
      />

      <ServiceTypeOverview 
        serviceTypeStats={serviceTypeStats} 
        formatValue={formatValue} 
      />

      <ServiceAssignmentTable
        assignments={assignments}
        getProgressPercentage={getProgressPercentage}
        getProgressBadge={getProgressBadge}
        formatValue={formatValue}
      />

      {stats.criticalCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Performance Alert:</strong> {stats.criticalCount} service assignment(s) are significantly behind target. 
            Consider reassigning resources or adjusting targets to ensure project success.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ServiceAssignment;
