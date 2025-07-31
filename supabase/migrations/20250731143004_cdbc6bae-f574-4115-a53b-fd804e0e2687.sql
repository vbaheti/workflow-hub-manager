
-- Create the targets table
CREATE TABLE public.targets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  project_id uuid REFERENCES public.projects(id),
  metric_type text NOT NULL CHECK (metric_type IN ('revenue', 'services_completed', 'fee_collection', 'training_camps', 'citizens_trained')),
  target_value numeric NOT NULL DEFAULT 0,
  current_progress numeric NOT NULL DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  assigned_to_id uuid REFERENCES public.profiles(id),
  parent_target_id uuid REFERENCES public.targets(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all authenticated users to read targets" 
  ON public.targets 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow all authenticated users to create targets" 
  ON public.targets 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update targets" 
  ON public.targets 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow all authenticated users to delete targets" 
  ON public.targets 
  FOR DELETE 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_targets_project_id ON public.targets(project_id);
CREATE INDEX idx_targets_assigned_to_id ON public.targets(assigned_to_id);
CREATE INDEX idx_targets_status ON public.targets(status);
