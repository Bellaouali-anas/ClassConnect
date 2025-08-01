import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldX, Home } from 'lucide-react';

export default function Unauthorized() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setLocation('/')}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 