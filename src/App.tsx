
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ServiceAgents from "./components/ServiceAgents";
import FinancialTransactions from "./components/FinancialTransactions";
import ApprovalWorkflow from "./components/ApprovalWorkflow";
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
            <Route path="/hrms" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">HRMS Module</h2><p className="text-muted-foreground mt-2">Human Resource Management features coming soon...</p></div>} />
            <Route path="/transactions" element={<FinancialTransactions />} />
            <Route path="/fees" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Fee Collection</h2><p className="text-muted-foreground mt-2">Fee collection management coming soon...</p></div>} />
            <Route path="/commissions" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Commission Management</h2><p className="text-muted-foreground mt-2">Commission approval features coming soon...</p></div>} />
            <Route path="/reimbursements" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Reimbursements</h2><p className="text-muted-foreground mt-2">Reimbursement processing coming soon...</p></div>} />
            <Route path="/bank-details" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Bank Details</h2><p className="text-muted-foreground mt-2">Bank details management coming soon...</p></div>} />
            <Route path="/approvals" element={<ApprovalWorkflow />} />
            <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Settings</h2><p className="text-muted-foreground mt-2">System settings coming soon...</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
