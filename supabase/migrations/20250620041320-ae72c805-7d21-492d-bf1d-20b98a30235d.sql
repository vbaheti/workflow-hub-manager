
-- Create employees table for HRMS
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT,
  position TEXT,
  salary DECIMAL(10,2),
  hire_date DATE,
  status employee_status DEFAULT 'active',
  manager_id UUID REFERENCES public.employees(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_code TEXT UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee_collections table
CREATE TABLE public.fee_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id INTEGER REFERENCES public.agents(id),
  service_id UUID REFERENCES public.services(id),
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  collection_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'cash',
  status payment_status DEFAULT 'paid',
  receipt_number TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_transactions table
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type TEXT NOT NULL, -- 'income', 'expense', 'commission', 'reimbursement'
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id UUID, -- can reference fee_collections, reimbursements, etc.
  agent_id INTEGER REFERENCES public.agents(id),
  employee_id UUID REFERENCES public.employees(id),
  transaction_date DATE DEFAULT CURRENT_DATE,
  status payment_status DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reimbursements table
CREATE TABLE public.reimbursements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  agent_id INTEGER REFERENCES public.agents(id),
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL, -- 'travel', 'accommodation', 'meals', 'supplies', 'other'
  description TEXT,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  status approval_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  remarks TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commission_approvals table
CREATE TABLE public.commission_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id INTEGER REFERENCES public.agents(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_collections DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
  bonus_amount DECIMAL(10,2) DEFAULT 0,
  deduction_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status approval_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  payment_date DATE,
  remarks TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_pricing table
CREATE TABLE public.service_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id),
  location_type TEXT, -- 'state', 'district', 'area'
  location_value TEXT,
  price DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  effective_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bank_details table
CREATE TABLE public.bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'agent', 'employee'
  entity_id TEXT NOT NULL, -- agent_id or employee_id
  account_holder_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  branch_name TEXT,
  account_type TEXT DEFAULT 'savings',
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, account_number)
);

-- Create approval_workflows table
CREATE TABLE public.approval_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_type TEXT NOT NULL, -- 'reimbursement', 'commission', 'expense'
  entity_id UUID NOT NULL,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 1,
  status approval_status DEFAULT 'pending',
  requested_by UUID REFERENCES auth.users(id),
  current_approver UUID REFERENCES auth.users(id),
  approved_by UUID[] DEFAULT '{}',
  rejected_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample services
INSERT INTO public.services (service_name, service_code, description, base_price, category) VALUES
('Aadhaar Card Application', 'AADHAAR_NEW', 'New Aadhaar card registration', 25.00, 'Identity'),
('Aadhaar Card Update', 'AADHAAR_UPDATE', 'Update existing Aadhaar card details', 50.00, 'Identity'),
('PAN Card Application', 'PAN_NEW', 'New PAN card application', 107.00, 'Identity'),
('Passport Application', 'PASSPORT_NEW', 'New passport application assistance', 500.00, 'Identity'),
('Driving License', 'DL_NEW', 'New driving license application', 200.00, 'Transport'),
('Voter ID Card', 'VOTER_NEW', 'New voter ID card registration', 25.00, 'Identity'),
('Birth Certificate', 'BIRTH_CERT', 'Birth certificate application', 50.00, 'Civil'),
('Income Certificate', 'INCOME_CERT', 'Income certificate application', 30.00, 'Civil');

-- Insert Super Admin user (you'll need to sign up first, then update the role)
-- Note: You need to sign up with this email first, then run the UPDATE statement below

-- Insert Admin user (you'll need to sign up first, then update the role)  
-- Note: You need to sign up with this email first, then run the UPDATE statement below

-- Enable RLS on new tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (view access for authenticated users with appropriate roles)
CREATE POLICY "Authenticated users can view services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin'));

CREATE POLICY "Users can view relevant fee collections" ON public.fee_collections FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor', 'agent')
);
CREATE POLICY "Agents can create fee collections" ON public.fee_collections FOR INSERT TO authenticated WITH CHECK (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor', 'agent')
);

CREATE POLICY "Users can view financial transactions" ON public.financial_transactions FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor')
);

CREATE POLICY "Users can view reimbursements" ON public.reimbursements FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor') OR 
  created_by = auth.uid()
);
CREATE POLICY "Users can create reimbursements" ON public.reimbursements FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Managers can view commission approvals" ON public.commission_approvals FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
);

CREATE POLICY "Admins can manage service pricing" ON public.service_pricing FOR ALL TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
);

CREATE POLICY "Users can view bank details" ON public.bank_details FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager') OR 
  created_by = auth.uid()
);

CREATE POLICY "HR can view employees" ON public.employees FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
);

CREATE POLICY "Users can view approval workflows" ON public.approval_workflows FOR SELECT TO authenticated USING (
  public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor') OR 
  requested_by = auth.uid() OR current_approver = auth.uid()
);
