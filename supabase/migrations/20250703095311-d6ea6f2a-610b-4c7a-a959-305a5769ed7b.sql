
-- Add manager hierarchy to profiles for top-down accountability
ALTER TABLE public.profiles 
ADD COLUMN manager_id uuid REFERENCES public.profiles(id);

-- Add supervisor to agents for field management
ALTER TABLE public.agents 
ADD COLUMN supervisor_id uuid REFERENCES public.profiles(id);

-- Add project lead and vertical to projects
ALTER TABLE public.projects 
ADD COLUMN project_lead_id uuid REFERENCES public.profiles(id),
ADD COLUMN vertical_id uuid REFERENCES public.verticals(id);

-- Create targets table for the top-down target splitting workflow
CREATE TABLE public.targets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  project_id uuid REFERENCES public.projects(id),
  metric_type text NOT NULL CHECK (metric_type IN ('revenue', 'services_completed', 'fee_collection', 'training_camps', 'citizens_trained')),
  target_value numeric NOT NULL DEFAULT 0,
  current_progress numeric NOT NULL DEFAULT 0,
  assigned_to_id uuid REFERENCES public.profiles(id) NOT NULL,
  parent_target_id uuid REFERENCES public.targets(id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on targets table
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;

-- RLS policies for targets
CREATE POLICY "Users can view their assigned targets and their team's targets"
  ON public.targets
  FOR SELECT
  USING (
    assigned_to_id = auth.uid() OR
    assigned_to_id IN (
      SELECT id FROM public.profiles WHERE manager_id = auth.uid()
    ) OR
    get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role, 'manager'::user_role])
  );

CREATE POLICY "Managers can create and update targets for their team"
  ON public.targets
  FOR ALL
  USING (
    assigned_to_id = auth.uid() OR
    assigned_to_id IN (
      SELECT id FROM public.profiles WHERE manager_id = auth.uid()
    ) OR
    get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role, 'manager'::user_role])
  );

-- Create indexes for better performance
CREATE INDEX idx_targets_assigned_to ON public.targets(assigned_to_id);
CREATE INDEX idx_targets_project_id ON public.targets(project_id);
CREATE INDEX idx_targets_parent_target ON public.targets(parent_target_id);
CREATE INDEX idx_profiles_manager_id ON public.profiles(manager_id);
CREATE INDEX idx_agents_supervisor_id ON public.agents(supervisor_id);

-- Update existing tables to support the new workflow
-- Add budget tracking to projects (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'budget' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN budget numeric DEFAULT 0;
  END IF;
END $$;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to targets table
CREATE TRIGGER update_targets_updated_at 
  BEFORE UPDATE ON public.targets 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
