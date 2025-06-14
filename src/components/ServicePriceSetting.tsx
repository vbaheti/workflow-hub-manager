
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, DollarSign, TrendingUp, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServicePrice {
  id: string;
  serviceName: string;
  category: string;
  basePrice: number;
  commissionRate: number;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

const mockServicePrices: ServicePrice[] = [
  {
    id: 'SRV-001',
    serviceName: 'Legal Consultation',
    category: 'Legal Services',
    basePrice: 5000,
    commissionRate: 15,
    isActive: true,
    lastUpdated: '2024-01-15',
    updatedBy: 'Admin'
  },
  {
    id: 'SRV-002',
    serviceName: 'Document Processing',
    category: 'Administrative',
    basePrice: 3200,
    commissionRate: 12,
    isActive: true,
    lastUpdated: '2024-01-14',
    updatedBy: 'Admin'
  },
  {
    id: 'SRV-003',
    serviceName: 'Business Registration',
    category: 'Registration',
    basePrice: 8500,
    commissionRate: 18,
    isActive: true,
    lastUpdated: '2024-01-13',
    updatedBy: 'Admin'
  },
  {
    id: 'SRV-004',
    serviceName: 'Tax Filing Assistance',
    category: 'Financial',
    basePrice: 2500,
    commissionRate: 10,
    isActive: false,
    lastUpdated: '2024-01-12',
    updatedBy: 'Admin'
  }
];

export default function ServicePriceSetting() {
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>(mockServicePrices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<ServicePrice | null>(null);
  const { toast } = useToast();

  const [newService, setNewService] = useState({
    serviceName: '',
    category: '',
    basePrice: '',
    commissionRate: ''
  });

  const categories = ['Legal Services', 'Administrative', 'Registration', 'Financial', 'Consultation'];

  const handleAddService = () => {
    if (!newService.serviceName || !newService.category || !newService.basePrice || !newService.commissionRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const service: ServicePrice = {
      id: `SRV-${String(servicePrices.length + 1).padStart(3, '0')}`,
      serviceName: newService.serviceName,
      category: newService.category,
      basePrice: parseFloat(newService.basePrice),
      commissionRate: parseFloat(newService.commissionRate),
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Current User'
    };

    setServicePrices([...servicePrices, service]);
    setNewService({ serviceName: '', category: '', basePrice: '', commissionRate: '' });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Service price added successfully"
    });
  };

  const handleUpdateService = (service: ServicePrice) => {
    setServicePrices(servicePrices.map(s => 
      s.id === service.id 
        ? { ...service, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: 'Current User' }
        : s
    ));
    setEditingService(null);
    
    toast({
      title: "Success",
      description: "Service price updated successfully"
    });
  };

  const handleDeleteService = (id: string) => {
    setServicePrices(servicePrices.filter(s => s.id !== id));
    
    toast({
      title: "Success",
      description: "Service price deleted successfully"
    });
  };

  const toggleServiceStatus = (id: string) => {
    setServicePrices(servicePrices.map(s => 
      s.id === id 
        ? { ...s, isActive: !s.isActive, lastUpdated: new Date().toISOString().split('T')[0] }
        : s
    ));
    
    toast({
      title: "Success",
      description: "Service status updated successfully"
    });
  };

  const activeServices = servicePrices.filter(s => s.isActive).length;
  const averagePrice = servicePrices.length > 0 ? Math.round(servicePrices.reduce((sum, s) => sum + s.basePrice, 0) / servicePrices.length) : 0;
  const averageCommission = servicePrices.length > 0 ? Math.round(servicePrices.reduce((sum, s) => sum + s.commissionRate, 0) / servicePrices.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Price Setting</h2>
          <p className="text-muted-foreground">Manage service prices and commission rates</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{servicePrices.length}</div>
            <p className="text-xs text-muted-foreground">{activeServices} active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per service</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{averageCommission}%</div>
            <p className="text-xs text-muted-foreground">Commission rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Settings className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Service types</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Service Form */}
      {(showAddForm || editingService) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={editingService ? editingService.serviceName : newService.serviceName}
                  onChange={(e) => editingService 
                    ? setEditingService({...editingService, serviceName: e.target.value})
                    : setNewService({...newService, serviceName: e.target.value})
                  }
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={editingService ? editingService.category : newService.category}
                  onValueChange={(value) => editingService
                    ? setEditingService({...editingService, category: value})
                    : setNewService({...newService, category: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={editingService ? editingService.basePrice : newService.basePrice}
                  onChange={(e) => editingService
                    ? setEditingService({...editingService, basePrice: parseFloat(e.target.value) || 0})
                    : setNewService({...newService, basePrice: e.target.value})
                  }
                  placeholder="Enter base price"
                />
              </div>
              <div>
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={editingService ? editingService.commissionRate : newService.commissionRate}
                  onChange={(e) => editingService
                    ? setEditingService({...editingService, commissionRate: parseFloat(e.target.value) || 0})
                    : setNewService({...newService, commissionRate: e.target.value})
                  }
                  placeholder="Enter commission rate"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={editingService ? () => handleUpdateService(editingService) : handleAddService}>
                <Save className="h-4 w-4 mr-2" />
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingService(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Pricing</CardTitle>
          <CardDescription>Manage all service prices and commission rates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicePrices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell className="font-semibold">${service.basePrice.toLocaleString()}</TableCell>
                  <TableCell>{service.commissionRate}%</TableCell>
                  <TableCell>
                    <Badge className={service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(service.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleServiceStatus(service.id)}
                      >
                        {service.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
