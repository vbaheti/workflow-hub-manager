
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Shield, 
  Building, 
  Users, 
  Eye, 
  Crown, 
  UserCheck,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  approved: boolean;
}

const roleIcons = {
  super_admin: Crown,
  admin: Shield,
  manager: Building,
  supervisor: UserCheck,
  agent: User,
  viewer: Eye,
  partner_admin: Users
};

const UserApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const pending = data?.filter(user => !user.approved) || [];
      const approved = data?.filter(user => user.approved) || [];
      
      setPendingUsers(pending);
      setApprovedUsers(approved);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User Approved",
        description: "User has been approved and can now access the system"
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive"
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User Rejected",
        description: "User registration has been rejected and removed"
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (profile?.role !== 'super_admin' && profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access user approvals.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const UserCard = ({ user, isPending }: { user: PendingUser; isPending: boolean }) => {
    const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User;
    
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {user.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user.full_name || user.email}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <RoleIcon className="h-3 w-3" />
                  <Badge variant="outline" className="text-xs">
                    {user.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isPending ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApproveUser(user.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectUser(user.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              ) : (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Registered: {new Date(user.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Approval Management</h1>
        <p className="text-muted-foreground">
          Review and approve new user registrations
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({approvedUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Approvals</h3>
                <p className="text-muted-foreground">
                  All user registrations have been processed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pendingUsers.map((user) => (
                <UserCard key={user.id} user={user} isPending={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Approved Users</h3>
                <p className="text-muted-foreground">
                  No users have been approved yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {approvedUsers.map((user) => (
                <UserCard key={user.id} user={user} isPending={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserApprovalPage;
