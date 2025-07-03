
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Dashboard from './components/Dashboard';
import AgentsPage from './pages/AgentsPage';
import ProjectsPage from './pages/ProjectsPage';
import ServiceDeliveryPage from './pages/ServiceDeliveryPage';
import TrainingPage from './pages/TrainingPage';
import FinancialHubPage from './pages/FinancialHubPage';
import FeeCollection from './components/FeeCollection';
import FinancialTransactions from './components/FinancialTransactions';
import Reimbursements from './components/Reimbursements';
import HRMS from './components/HRMS';
import SettingsPage from './pages/SettingsPage';
import CommissionApproval from './components/CommissionApproval';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import ServicePricingManagement from './components/ServicePricingManagement';
import BankDetails from './components/BankDetails';
import UserApprovalPage from './components/UserApprovalPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { StateProvider } from './contexts/StateContext';
import { RBACProvider } from './contexts/RBACContext';
import { ApprovalProvider } from './contexts/ApprovalContext';
import { DefaultValuesProvider } from './contexts/DefaultValuesContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DefaultValuesProvider>
          <RBACProvider>
            <ProjectProvider>
              <StateProvider>
                <ApprovalProvider>
                  <Router>
                    <Routes>
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/" element={
                        <ProtectedRoute>
                          <Layout>
                            <Dashboard />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Layout>
                            <Dashboard />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Operations Routes */}
                      <Route path="/projects" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <ProjectsPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/agents" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager', 'supervisor', 'agent']}>
                          <Layout>
                            <AgentsPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/service-delivery" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager', 'supervisor', 'agent']}>
                          <Layout>
                            <ServiceDeliveryPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/training" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager', 'supervisor']}>
                          <Layout>
                            <TrainingPage />
                          </Layout>
                        </ProtectedRoute>
                      } />

                      {/* Finance Routes */}
                      <Route path="/financial-hub" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <FinancialHubPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/revenue" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager', 'supervisor', 'agent']}>
                          <Layout>
                            <FeeCollection />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/expenses" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager', 'supervisor']}>
                          <Layout>
                            <Reimbursements />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/pnl-reports" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <FinancialTransactions />
                          </Layout>
                        </ProtectedRoute>
                      } />

                      {/* HR Routes */}
                      <Route path="/hrms" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <HRMS />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/payroll" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <CommissionApproval />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/bank-assets" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <BankDetails />
                          </Layout>
                        </ProtectedRoute>
                      } />

                      {/* System Administration Routes */}
                      <Route path="/user-approvals" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                          <Layout>
                            <UserApprovalPage />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/approvals" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager', 'supervisor']}>
                          <Layout>
                            <ApprovalWorkflow />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/pricing" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
                          <Layout>
                            <ServicePricingManagement />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                          <Layout>
                            <SettingsPage />
                          </Layout>
                        </ProtectedRoute>
                      } />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Router>
                </ApprovalProvider>
              </StateProvider>
            </ProjectProvider>
          </RBACProvider>
        </DefaultValuesProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
