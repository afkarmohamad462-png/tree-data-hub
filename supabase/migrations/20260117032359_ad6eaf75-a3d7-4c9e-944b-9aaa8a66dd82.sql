-- Drop the public SELECT policy that exposes PII
DROP POLICY IF EXISTS "Anyone can view tree registrations" ON public.tree_registrations;

-- Create new policy: Only admins can view tree registrations
CREATE POLICY "Only admins can view tree registrations" 
ON public.tree_registrations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));