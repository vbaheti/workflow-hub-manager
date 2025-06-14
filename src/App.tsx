
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectProvider } from './contexts/ProjectContext';
import { StateProvider } from './contexts/StateContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ServiceAgents from './components/ServiceAgents';
import HRMS from './components/HRMS';
import FinancialTransactions from './components/FinancialTransactions';
import FeeCollection from './components/FeeCollection';
import CommissionApproval from './components/CommissionApproval';
import ServicePriceSetting from './components/ServicePriceSetting';
import Reimbursements from './components/Reimbursements';
import BankDetails from './components/BankDetails';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import Settings from './components/Settings';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <StateProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/agents" element={<ServiceAgents />} />
                  <Route path="/hrms" element={<HRMS />} />
                  <Route path="/transactions" element={<FinancialTransactions />} />
                  <Route path="/fees" element={<FeeCollection />} />
                  <Route path="/commissions" element={<CommissionApproval />} />
                  <Route path="/pricing" element={<ServicePriceSetting />} />
                  <Route path="/reimbursements" element={<Reimbursements />} />
                  <Route path="/bank-details" element={<BankDetails />} />
                  <Route path="/approvals" element={<ApprovalWorkflow />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Toaster />
            </Router>
          </StateProvider>
        </ProjectProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
