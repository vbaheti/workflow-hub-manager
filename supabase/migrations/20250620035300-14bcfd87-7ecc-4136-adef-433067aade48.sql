
-- Create additional enums for the comprehensive system
CREATE TYPE service_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'on_leave', 'terminated');
CREATE TYPE training_type AS ENUM ('skill_development', 'awareness', 'capacity_building', 'livelihood');
CREATE TYPE training_status AS ENUM ('planned', 'ongoing', 'completed', 'me_pending');

-- Create training camps table
CREATE TABLE public.training_camps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id INTEGER REFERENCES public.agents(id),
  agent_name TEXT NOT NULL,
  trainer_id INTEGER,
  trainer_name TEXT,
  camp_name TEXT NOT NULL,
  location TEXT,
  state TEXT,
  district TEXT,
  taluk TEXT,
  village TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_citizens INTEGER DEFAULT 0,
  registered_citizens INTEGER DEFAULT 0,
  completed_citizens INTEGER DEFAULT 0,
  training_type training_type DEFAULT 'skill_development',
  status training_status DEFAULT 'planned',
  me_completed_date DATE,
  me_score INTEGER,
  camp_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training targets table
CREATE TABLE public.training_targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id INTEGER REFERENCES public.agents(id),
  agent_name TEXT NOT NULL,
  target_camps INTEGER DEFAULT 0,
  target_citizens INTEGER DEFAULT 0,
  actual_camps INTEGER DEFAULT 0,
  actual_citizens INTEGER DEFAULT 0,
  period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  state TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  agent_count INTEGER DEFAULT 0,
  route_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE public.training_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Role based access for training_camps" ON public.training_camps
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor', 'agent', 'viewer', 'partner_admin'));

CREATE POLICY "Role based access for training_targets" ON public.training_targets
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor', 'agent', 'viewer', 'partner_admin'));

CREATE POLICY "Role based access for projects" ON public.projects
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor', 'agent', 'viewer', 'partner_admin'));

-- Insert sample training data
INSERT INTO public.training_camps (agent_id, agent_name, trainer_name, camp_name, location, state, district, taluk, village, start_date, end_date, target_citizens, registered_citizens, completed_citizens, training_type, status) VALUES
(1, 'John Doe', 'Dr. Smith', 'Digital Literacy Camp', 'Community Center', 'California', 'Los Angeles', 'Downtown', 'Central LA', '2024-01-15', '2024-01-20', 50, 45, 42, 'skill_development', 'completed'),
(2, 'Jane Smith', 'Prof. Johnson', 'Health Awareness Program', 'School Hall', 'California', 'San Francisco', 'Mission', 'Mission Bay', '2024-02-10', '2024-02-15', 60, 55, 50, 'awareness', 'completed'),
(3, 'Mike Johnson', 'Dr. Williams', 'Livelihood Training', 'Training Center', 'Texas', 'Houston', 'Memorial', 'Memorial Park', '2024-03-01', '2024-03-10', 40, 38, 35, 'livelihood', 'ongoing');

INSERT INTO public.training_targets (agent_id, agent_name, target_camps, target_citizens, actual_camps, actual_citizens, period) VALUES
(1, 'John Doe', 12, 600, 8, 420, 'Q1-2024'),
(2, 'Jane Smith', 10, 500, 6, 300, 'Q1-2024'),
(3, 'Mike Johnson', 8, 400, 4, 200, 'Q1-2024');

INSERT INTO public.projects (name, description, location, state, agent_count, route_count, status) VALUES
('Mumbai Financial Hub', 'Financial services in Mumbai metropolitan area', 'Mumbai', 'Maharashtra', 15, 8, 'active'),
('Delhi Service Network', 'Government services delivery in Delhi NCR', 'Delhi', 'Delhi', 12, 6, 'active'),
('Bangalore Tech Corridor', 'Digital services for tech companies', 'Bangalore', 'Karnataka', 10, 5, 'active');
