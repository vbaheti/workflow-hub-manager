
-- First, let's make sure we have the user_role enum and profiles table
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'supervisor', 'agent', 'viewer', 'partner_admin');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'viewer',
  project_id TEXT,
  partner_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create agents table FIRST (before other tables that reference it)
CREATE TABLE public.agents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  state TEXT,
  district TEXT,
  area TEXT,
  status TEXT DEFAULT 'active',
  performance_score DECIMAL(3,2) DEFAULT 0,
  total_collections DECIMAL(10,2) DEFAULT 0,
  services_completed INTEGER DEFAULT 0,
  assigned_routes TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for agents
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create policy for agents based on user role
CREATE POLICY "Users can view agents based on role" ON public.agents
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager', 'supervisor', 'agent', 'viewer', 'partner_admin')
  );

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample agents data
INSERT INTO public.agents (name, email, phone, location, state, district, area, status, performance_score, total_collections, services_completed) VALUES
('John Doe', 'john@example.com', '+1234567890', 'Downtown', 'California', 'Los Angeles', 'Central LA', 'active', 4.5, 15000.00, 25),
('Jane Smith', 'jane@example.com', '+1234567891', 'Uptown', 'California', 'San Francisco', 'Mission Bay', 'active', 4.2, 12000.00, 18),
('Mike Johnson', 'mike@example.com', '+1234567892', 'Suburbs', 'Texas', 'Houston', 'Memorial', 'active', 3.8, 8000.00, 12);
