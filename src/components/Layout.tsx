
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Receipt, 
  UserCog, 
  Settings,
  CheckSquare,
  DollarSign,
  Building2,
  Workflow,
  Menu,
  UserCheck
} from 'lucide-react';
import UserProfile from './UserProfile';
import StateSelector from './StateSelector';
import RoleSelector from './RoleSelector';
import ProjectSelector from './ProjectSelector';
import { useProject } from '@/contexts/ProjectContext';

// Define the Project interface that matches the database schema
interface DatabaseProject {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  state: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
}

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Service Agents', href: '/agents', icon: Users },
  { name: 'Fee Collection', href: '/fees', icon: CreditCard },
  { name: 'Financial Transactions', href: '/transactions', icon: TrendingUp },
  { name: 'Reimbursements', href: '/reimbursements', icon: Receipt },
  { name: 'HRMS', href: '/hrms', icon: UserCog },
  { name: 'Commission Approval', href: '/commissions', icon: CheckSquare },
  { name: 'Service Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Bank Details', href: '/bank-details', icon: Building2 },
  { name: 'Approval Workflow', href: '/approvals', icon: Workflow },
  { name: 'User Approvals', href: '/user-approvals', icon: UserCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { selectedProject, setSelectedProject, projects } = useProject();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="font-bold">Service Hub</span>
        </Link>
      </div>

      {/* Project and State Selectors */}
      <div className="space-y-4 p-4 border-b">
        <ProjectSelector 
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          projects={projects as DatabaseProject[]}
        />
        <StateSelector />
        <RoleSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 border-r bg-background lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
          
          <div className="flex items-center space-x-4">
            <UserProfile />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
