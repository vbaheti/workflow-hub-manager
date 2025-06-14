
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ServiceAgents from "./components/ServiceAgents";
import HRMS from "./components/HRMS";
import FinancialTransactions from "./components/FinancialTransactions";
import Reimbursements from "./components/Reimbursements";
import BankDetails from "./components/BankDetails";
import ApprovalWorkflow from "./components/ApprovalWorkflow";
import Settings from "./components/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agents" element={<ServiceAgents />} />
            <Route path="/hrms" element={<HRMS />} />
            <Route path="/transactions" element={<FinancialTransactions />} />
            <Route path="/fees" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Fee Collection</h2><p className="text-muted-foreground mt-2">Fee collection management coming soon...</p></div>} />
            <Route path="/commissions" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Commission Management</h2><p className="text-muted-foreground mt-2">Commission approval features coming soon...</p></div>} />
            <Route path="/reimbursements" element={<Reimbursements />} />
            <Route path="/bank-details" element={<BankDetails />} />
            <Route path="/approvals" element={<ApprovalWorkflow />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
