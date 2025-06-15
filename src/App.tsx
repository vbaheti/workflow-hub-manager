import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Dashboard from './components/Dashboard';
import ServiceAgents from './components/ServiceAgents';
import FeeCollection from './components/FeeCollection';
import FinancialTransactions from './components/FinancialTransactions';
import Reimbursements from './components/Reimbursements';
import HRMS from './components/HRMS';
import Settings from './components/Settings';
import CommissionApproval from './components/CommissionApproval';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import ServicePriceSetting from './components/ServicePriceSetting';
import BankDetails from './components/BankDetails';
import ServicePricingManagement from './components/ServicePricingManagement';
import { ProjectProvider } from './contexts/ProjectContext';
import { StateProvider } from './contexts/StateContext';
import { RBACProvider } from './contexts/RBACContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider>
        <ProjectProvider>
          <StateProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agents" element={<ServiceAgents />} />
                  <Route path="/fees" element={<FeeCollection />} />
                  <Route path="/transactions" element={<FinancialTransactions />} />
                  <Route path="/reimbursements" element={<Reimbursements />} />
                  <Route path="/hrms" element={<HRMS />} />
                  <Route path="/commissions" element={<CommissionApproval />} />
                  <Route path="/pricing" element={<ServicePricingManagement />} />
                  <Route path="/bank-details" element={<BankDetails />} />
                  <Route path="/approvals" element={<ApprovalWorkflow />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
          </StateProvider>
        </ProjectProvider>
      </RBACProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
