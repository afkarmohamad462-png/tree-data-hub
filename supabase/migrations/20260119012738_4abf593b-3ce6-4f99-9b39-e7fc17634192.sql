-- Create table for site settings including hero section
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view settings (for displaying on public pages)
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero settings
INSERT INTO public.site_settings (key, value) VALUES (
  'hero',
  '{
    "badge_text": "Sistem Pendataan Pohon",
    "title_line1": "Bank Data",
    "title_line2": "Pohon",
    "description": "Sistem pendataan pohon untuk mendukung program Agro Mopomulo untuk pelestarian lingkungan. Mari bersama menjaga bumi untuk generasi mendatang.",
    "button_text": "Form Pendataan Pohon",
    "stat1_value": "10K+",
    "stat1_label": "Pohon Tercatat",
    "stat2_value": "50+",
    "stat2_label": "Jenis Pohon",
    "stat3_value": "25",
    "stat3_label": "OPD Terlibat",
    "image_url": "",
    "image_type": "default"
  }'::jsonb
);

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true);

-- Storage policies for hero images bucket
CREATE POLICY "Anyone can view hero images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hero-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hero-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hero-images' AND has_role(auth.uid(), 'admin'::app_role));