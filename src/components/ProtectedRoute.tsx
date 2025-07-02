
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { user, profile, loading } = useAuth();

  console.log('ProtectedRoute - Loading:', loading, 'User:', !!user, 'Profile:', !!profile);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // If user exists but no profile, they might not be in the system yet
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Setting up your account
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we set up your profile. If this takes too long, please contact support.
            </p>
            <div className="text-sm text-gray-500">
              User: {user.email}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is approved
  if (!profile.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Account Pending Approval
            </h2>
            <p className="text-gray-600 mb-4">
              Your account is waiting for administrator approval. You'll receive access once approved.
            </p>
            <div className="text-sm text-gray-500">
              If you have any questions, please contact your system administrator.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - Rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
