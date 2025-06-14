
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, CheckCircle, XCircle, AlertCircle, CreditCard, Phone, Mail, FileText } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  eKycStatus: 'verified' | 'pending' | 'rejected';
  governmentId1: { type: string; status: 'verified' | 'pending'; number: string };
  governmentId2: { type: string; status: 'verified' | 'pending'; number: string };
  bankDetails: { verified: boolean; accountNumber: string; bankName: string };
  mobileVerified: boolean;
  emailVerified: boolean;
  currentProjects: string[];
  profilePicture: string;
  joinDate: string;
  rating: number;
}

const verifiedAgentsPool: Agent[] = [
  {
    id: 'AGT001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543210',
    location: 'Mumbai, Maharashtra, India',
    eKycStatus: 'verified',
    governmentId1: { type: 'Aadhaar Card', status: 'verified', number: '****-****-1234' },
    governmentId2: { type: 'PAN Card', status: 'verified', number: 'ABCDE****F' },
    bankDetails: { verified: true, accountNumber: '****-****-5678', bankName: 'State Bank of India' },
    mobileVerified: true,
    emailVerified: true,
    currentProjects: ['Mumbai Financial Hub'],
    profilePicture: '',
    joinDate: '2023-01-15',
    rating: 4.8
  },
  {
    id: 'AGT002',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+880-1712345678',
    location: 'Dhaka, Bangladesh',
    eKycStatus: 'verified',
    governmentId1: { type: 'National ID', status: 'verified', number: '****-****-9876' },
    governmentId2: { type: 'Passport', status: 'verified', number: 'BD****789' },
    bankDetails: { verified: true, accountNumber: '****-****-3456', bankName: 'Dutch-Bangla Bank' },
    mobileVerified: true,
    emailVerified: true,
    currentProjects: [],
    profilePicture: '',
    joinDate: '2023-03-20',
    rating: 4.5
  },
  {
    id: 'AGT003',
    name: 'Chen Wei Ming',
    email: 'chen.weiming@email.com',
    phone: '+65-87654321',
    location: 'Singapore',
    eKycStatus: 'verified',
    governmentId1: { type: 'NRIC', status: 'verified', number: 'S****567A' },
    governmentId2: { type: 'Passport', status: 'verified', number: 'SG****123' },
    bankDetails: { verified: true, accountNumber: '****-****-7890', bankName: 'DBS Bank' },
    mobileVerified: true,
    emailVerified: true,
    currentProjects: ['Singapore Financial Hub'],
    profilePicture: '',
    joinDate: '2023-02-10',
    rating: 4.9
  },
  {
    id: 'AGT004',
    name: 'Amara Okafor',
    email: 'amara.okafor@email.com',
    phone: '+234-8031234567',
    location: 'Lagos, Nigeria',
    eKycStatus: 'verified',
    governmentId1: { type: 'National ID', status: 'verified', number: '****-****-4567' },
    governmentId2: { type: 'Voter\'s Card', status: 'verified', number: 'NG****890' },
    bankDetails: { verified: true, accountNumber: '****-****-2345', bankName: 'First Bank of Nigeria' },
    mobileVerified: true,
    emailVerified: true,
    currentProjects: [],
    profilePicture: '',
    joinDate: '2023-04-12',
    rating: 4.7
  },
  {
    id: 'AGT005',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543211',
    location: 'Delhi, India',
    eKycStatus: 'pending',
    governmentId1: { type: 'Aadhaar Card', status: 'verified', number: '****-****-5678' },
    governmentId2: { type: 'PAN Card', status: 'pending', number: 'FGHIJ****K' },
    bankDetails: { verified: false, accountNumber: '****-****-9012', bankName: 'HDFC Bank' },
    mobileVerified: true,
    emailVerified: true,
    currentProjects: ['Delhi Service Network'],
    profilePicture: '',
    joinDate: '2023-05-01',
    rating: 4.2
  }
];

interface AddNewAgentFormProps {
  onAgentAdded: (agent: Agent) => void;
}

const AddNewAgentForm = ({ onAgentAdded }: AddNewAgentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { currentProject } = useProject();
  const { toast } = useToast();

  const filteredAgents = verifiedAgentsPool.filter(agent =>
    agent.eKycStatus === 'verified' &&
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     agent.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const handleAddAgent = () => {
    if (!selectedAgent || !currentProject) return;

    // Add the current project to agent's projects
    const updatedAgent = {
      ...selectedAgent,
      currentProjects: [...selectedAgent.currentProjects, currentProject.name]
    };

    onAgentAdded(updatedAgent);
    
    toast({
      title: "Agent Added Successfully",
      description: `${selectedAgent.name} has been added to ${currentProject.name}`,
    });

    setIsOpen(false);
    setSelectedAgent(null);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Agent to {currentProject?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search verified agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Agent Selection Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact & Location</TableHead>
                  <TableHead>eKYC Status</TableHead>
                  <TableHead>Government IDs</TableHead>
                  <TableHead>Bank Details</TableHead>
                  <TableHead>Current Projects</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className={selectedAgent?.id === agent.id ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={agent.profilePicture} />
                          <AvatarFallback>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {agent.id}</p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">★ {agent.rating}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span className="text-sm">{agent.email}</span>
                          {getVerificationIcon(agent.emailVerified)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{agent.phone}</span>
                          {getVerificationIcon(agent.mobileVerified)}
                        </div>
                        <p className="text-xs text-muted-foreground">{agent.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">{agent.governmentId1.type}</span>
                          {getVerificationIcon(agent.governmentId1.status === 'verified')}
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">{agent.governmentId2.type}</span>
                          {getVerificationIcon(agent.governmentId2.status === 'verified')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-3 w-3" />
                        <span className="text-xs">{agent.bankDetails.bankName}</span>
                        {getVerificationIcon(agent.bankDetails.verified)}
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.bankDetails.accountNumber}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.currentProjects.length === 0 ? (
                          <Badge variant="outline" className="text-xs">Available</Badge>
                        ) : (
                          agent.currentProjects.map((project, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {project}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={selectedAgent?.id === agent.id ? "default" : "outline"}
                        onClick={() => setSelectedAgent(agent)}
                      >
                        {selectedAgent?.id === agent.id ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Selected Agent Details */}
          {selectedAgent && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Agent Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Agent Name</Label>
                    <p className="text-sm">{selectedAgent.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Current Projects</Label>
                    <p className="text-sm">{selectedAgent.currentProjects.length} active projects</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Will be added to</Label>
                    <p className="text-sm font-medium text-blue-600">{currentProject?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Agent Rating</Label>
                    <p className="text-sm">★ {selectedAgent.rating}/5.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAgent} disabled={!selectedAgent}>
              Add Agent to Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAgentForm;
