
-- Create settings table for system-wide configurations
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verticals table for business verticals
CREATE TABLE public.verticals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#3b82f6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table for centralized expense tracking
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  vertical_id UUID REFERENCES public.verticals(id),
  agent_id INTEGER REFERENCES public.agents(id),
  employee_id UUID REFERENCES public.employees(id),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assets table for physical asset tracking
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_name TEXT NOT NULL,
  serial_number TEXT UNIQUE,
  asset_type TEXT NOT NULL,
  agent_id INTEGER REFERENCES public.agents(id),
  status TEXT DEFAULT 'available',
  purchase_date DATE,
  purchase_amount NUMERIC,
  warranty_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modify projects table to add new columns
ALTER TABLE public.projects 
ADD COLUMN budget NUMERIC DEFAULT 0,
ADD COLUMN project_lead_id UUID REFERENCES public.employees(id),
ADD COLUMN vertical_id UUID REFERENCES public.verticals(id);

-- Modify services table to add vertical_id
ALTER TABLE public.services 
ADD COLUMN vertical_id UUID REFERENCES public.verticals(id);

-- Add RLS policies for new tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Settings policies
CREATE POLICY "Admins can manage settings" 
  ON public.settings 
  FOR ALL 
  USING (get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role]));

CREATE POLICY "All authenticated users can read settings" 
  ON public.settings 
  FOR SELECT 
  USING (true);

-- Verticals policies
CREATE POLICY "All authenticated users can read verticals" 
  ON public.verticals 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage verticals" 
  ON public.verticals 
  FOR ALL 
  USING (get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role, 'manager'::user_role]));

-- Expenses policies
CREATE POLICY "Users can view relevant expenses" 
  ON public.expenses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create expenses" 
  ON public.expenses 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Managers can manage expenses" 
  ON public.expenses 
  FOR ALL 
  USING (get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role, 'manager'::user_role]));

-- Assets policies
CREATE POLICY "All authenticated users can read assets" 
  ON public.assets 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage assets" 
  ON public.assets 
  FOR ALL 
  USING (get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role, 'manager'::user_role]));

-- Insert some default settings
INSERT INTO public.settings (key, value, description) VALUES
('default_project', '"mumbai-financial"', 'Default project ID'),
('default_state', '"Maharashtra"', 'Default state'),
('default_role', '"manager"', 'Default user role'),
('company_name', '"Aegis ERP"', 'Company name'),
('financial_year_start', '"2024-04-01"', 'Financial year start date');

-- Insert default verticals
INSERT INTO public.verticals (name, description, color_code) VALUES
('Financial Services', 'Banking, loans, and financial assistance services', '#10b981'),
('Identity Services', 'Aadhaar, PAN, and other identity document services', '#3b82f6'),
('Government Services', 'Utility bills, certificates, and government schemes', '#8b5cf6'),
('Training & Development', 'Skill development and training programs', '#f59e0b');
