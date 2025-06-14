
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
import { ProjectProvider } from './contexts/ProjectContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agents" element={<ServiceAgents />} />
              <Route path="/fees" element={<FeeCollection />} />
              <Route path="/transactions" element={<FinancialTransactions />} />
              <Route path="/reimbursements" element={<Reimbursements />} />
              <Route path="/hrms" element={<HRMS />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ProjectProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
