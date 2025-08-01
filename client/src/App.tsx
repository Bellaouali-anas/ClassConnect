import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Classes from "@/pages/Classes";
import Attendance from "@/pages/Attendance";
import Grades from "@/pages/Grades";
import Assignments from "@/pages/Assignments";
import TeacherProfile from "@/pages/TeacherProfile";
import ClassDetail from "@/pages/ClassDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/unauthorized" component={Unauthorized} />
      
      {/* Protected routes */}
      <Route path="/">
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/students">
        <ProtectedRoute>
          <Layout>
            <Students />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/classes">
        <ProtectedRoute>
          <Layout>
            <Classes />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/classes/:id">
        <ProtectedRoute>
          <Layout>
            <ClassDetail />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/attendance">
        <ProtectedRoute>
          <Layout>
            <Attendance />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/grades">
        <ProtectedRoute>
          <Layout>
            <Grades />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/assignments">
        <ProtectedRoute>
          <Layout>
            <Assignments />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Layout>
            <TeacherProfile />
          </Layout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
