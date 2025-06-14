import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Users, DollarSign, FileText, CheckCircle, Building, Settings, Home, UserCheck, Wallet, CreditCard, LayoutDashboard, TrendingUp, Receipt } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Service Agents",
    url: "/agents",
    icon: Users,
  },
  {
    title: "HRMS",
    url: "/hrms", 
    icon: UserCheck,
  },
  {
    title: "Financial Transactions",
    url: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Fee Collection",
    url: "/fees",
    icon: DollarSign,
  },
  {
    title: "Commission Approval",
    url: "/commissions",
    icon: TrendingUp,
  },
  {
    title: "Service Pricing",
    url: "/pricing",
    icon: Settings,
  },
  {
    title: "Reimbursements",
    url: "/reimbursements",
    icon: Receipt,
  },
  {
    title: "Bank Details",
    url: "/bank-details",
    icon: Building,
  },
  {
    title: "Approval Workflow",
    url: "/approvals",
    icon: CheckCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-primary">Agent Portal</h2>
        <p className="text-sm text-muted-foreground">Service Management System</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Service Agent Management Portal</h1>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
