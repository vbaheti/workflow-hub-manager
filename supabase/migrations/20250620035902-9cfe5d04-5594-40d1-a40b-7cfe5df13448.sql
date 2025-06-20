
-- Add the approved column to the profiles table
ALTER TABLE public.profiles ADD COLUMN approved BOOLEAN NOT NULL DEFAULT false;

-- Update existing users to be approved by default (so they don't get locked out)
UPDATE public.profiles SET approved = true;
