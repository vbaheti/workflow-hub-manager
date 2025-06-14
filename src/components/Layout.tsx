
import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Users, DollarSign, FileText, CheckCircle, Building, Settings, Home, UserCheck, Wallet, CreditCard, LayoutDashboard, TrendingUp, Receipt } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject } from '../contexts/ProjectContext';

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
  const { selectedProject, setSelectedProject, projects, currentProject } = useProject();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-primary">Agent Portal</h2>
        <p className="text-sm text-muted-foreground">Service Management System</p>
        
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select Project</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentProject && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <p className="font-medium">{currentProject.description}</p>
              <p className="text-gray-600">{currentProject.agentCount} agents • {currentProject.routeCount} routes</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="nav-item">
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
      <div className="app-layout bg-gray-50">
        <AppSidebar />
        <main className="flex-1">
          <div className="app-header">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Service Agent Management Portal</h1>
            </div>
          </div>
          <div className="app-main-content">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
