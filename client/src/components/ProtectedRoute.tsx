import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    setLocation('/login');
    return null;
  }

  // Check user type if required
  if (requiredUserType) {
    const userType = user.user_metadata?.user_type;
    if (userType !== requiredUserType) {
      setLocation('/unauthorized');
      return null;
    }
  }

  return <>{children}</>;
} 