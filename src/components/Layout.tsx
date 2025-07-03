
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  UserCheck,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Truck,
  GraduationCap,
  PieChart,
  Banknote,
  FileText,
  Search,
  Shield
} from 'lucide-react';
import UserProfile from './UserProfile';
import StateSelector from './StateSelector';
import RoleSelector from './RoleSelector';
import ProjectSelector from './ProjectSelector';
import { useProject } from '@/contexts/ProjectContext';

// Define the Project interface that matches what ProjectSelector expects
interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  agentCount: number;
  routeCount: number;
  description: string;
}

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

const navigationSections = [
  {
    id: 'dashboard',
    title: 'Main Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    isCollapsible: false,
    requiredRoles: []
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: FolderOpen,
    isCollapsible: true,
    requiredRoles: [],
    items: [
      { name: 'Projects', href: '/projects', icon: Building2, requiredRoles: ['super_admin', 'admin', 'manager'] },
      { name: 'Agent Network', href: '/agents', icon: Users, requiredRoles: ['super_admin', 'admin', 'manager', 'supervisor', 'agent'] },
      { name: 'Service Delivery', href: '/service-delivery', icon: Truck, requiredRoles: ['super_admin', 'admin', 'manager', 'supervisor', 'agent'] },
      { name: 'Training Programs', href: '/training', icon: GraduationCap, requiredRoles: ['super_admin', 'admin', 'manager', 'supervisor'] },
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: DollarSign,
    isCollapsible: true,
    requiredRoles: [],
    items: [
      { name: 'Financial Hub', href: '/financial-hub', icon: PieChart, requiredRoles: ['super_admin', 'admin', 'manager'] },
      { name: 'Revenue', href: '/revenue', icon: CreditCard, requiredRoles: ['super_admin', 'admin', 'manager', 'supervisor', 'agent'] },
      { name: 'Expenses', href: '/expenses', icon: Receipt, requiredRoles: ['super_admin', 'admin', 'manager', 'supervisor'] },
      { name: 'P&L Reporting', href: '/pnl-reports', icon: FileText, requiredRoles: ['super_admin', 'admin', 'manager'] },
    ]
  },
  {
    id: 'hr',
    title: 'Human Resources',
    icon: UserCog,
    isCollapsible: true,
    requiredRoles: [],
    items: [
      { name: 'Employee Management', href: '/hrms', icon: Users, requiredRoles: ['super_admin', 'admin', 'manager'] },
      { name: 'Payroll & Commissions', href: '/payroll', icon: Banknote, requiredRoles: ['super_admin', 'admin', 'manager'] },
      { name: 'Bank & Asset Management', href: '/bank-assets', icon: Building2, requiredRoles: ['super_admin', 'admin', 'manager'] },
    ]
  },
  {
    id: 'admin',
    title: 'System Administration',
    icon: Shield,
    isCollapsible: true,
    requiredRoles: ['super_admin', 'admin'],
    items: [
      { name: 'User Approvals', href: '/user-approvals', icon: UserCheck, requiredRoles: ['super_admin', 'admin'] },
      { name: 'Approval Workflows', href: '/approvals', icon: Workflow, requiredRoles: ['super_admin', 'admin', 'manager', 'supervisor'] },
      { name: 'Service & Pricing Config', href: '/pricing', icon: DollarSign, requiredRoles: ['super_admin', 'admin', 'manager'] },
      { name: 'System Settings', href: '/settings', icon: Settings, requiredRoles: ['super_admin', 'admin'] },
    ]
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { selectedProject, setSelectedProject, projects: dbProjects } = useProject();

  // Transform database projects to match ProjectSelector interface
  const projects: Project[] = dbProjects.map(project => ({
    id: project.id,
    name: project.name,
    status: (project.status as 'active' | 'completed' | 'on-hold') || 'active',
    agentCount: 0, // Default value since not in database
    routeCount: 0, // Default value since not in database
    description: project.description || ''
  }));

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-bold text-lg">Aegis ERP</span>
            <span className="text-xs text-muted-foreground">Enterprise Resource Planning</span>
          </div>
        </Link>
      </div>

      {/* Project and State Selectors */}
      <div className="space-y-4 p-4 border-b">
        <ProjectSelector 
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          projects={projects}
        />
        <StateSelector />
        <RoleSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {navigationSections.map((section) => {
          const isActive = location.pathname === section.href;
          const isCollapsed = collapsedSections[section.id];
          
          if (!section.isCollapsible) {
            return (
              <Link
                key={section.id}
                to={section.href!}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.title}</span>
              </Link>
            );
          }

          return (
            <Collapsible key={section.id} open={!isCollapsed} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3 px-3 py-2 text-sm font-medium"
                >
                  <section.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-4">
                {section.items?.map((item) => {
                  const itemIsActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        itemIsActive
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
              </CollapsibleContent>
            </Collapsible>
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
            
            {/* Global Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, agents, transactions..."
                className="w-96 pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
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
