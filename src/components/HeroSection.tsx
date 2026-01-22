import { TreePine, Leaf, TreeDeciduous, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroForest from "@/assets/hero-forest.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TreeForm from "@/components/TreeForm";

interface HeroSettings {
  badge_text: string;
  title_line1: string;
  title_line2: string;
  description: string;
  button_text: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  image_url: string;
  image_type: "default" | "url" | "upload";
  // Gambar kedua
  secondary_image_url: string;
  secondary_image_type: "none" | "url" | "upload";
  secondary_image_title: string;
  secondary_image_description: string;
}

const defaultSettings: HeroSettings = {
  badge_text: "Sistem Pendataan Pohon",
  title_line1: "Bank Data",
  title_line2: "Pohon",
  description:
    "Sistem pendataan pohon untuk mendukung program Agro Mopomulo untuk pelestarian lingkungan. Mari bersama menjaga bumi untuk generasi mendatang.",
  button_text: "Form Pendataan Pohon",
  stat1_value: "10K+",
  stat1_label: "Pohon Tercatat",
  stat2_value: "50+",
  stat2_label: "Jenis Pohon",
  stat3_value: "25",
  stat3_label: "OPD Terlibat",
  image_url: "",
  image_type: "default",
  secondary_image_url: "",
  secondary_image_type: "none",
  secondary_image_title: "Dokumentasi Program Agro Mopomulo",
  secondary_image_description: "",
};

const HeroSection = () => {
  const { data: settings } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "hero")
        .single();

      if (error) return defaultSettings;
      return { ...defaultSettings, ...(data?.value as unknown as Partial<HeroSettings>) };
    },
  });

  const heroSettings = settings || defaultSettings;

  const backgroundImage =
    heroSettings.image_type !== "default" && heroSettings.image_url
      ? heroSettings.image_url
      : heroForest;

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        </div>

        {/* Decorative Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float opacity-20">
            <Leaf className="w-24 h-24 text-primary-foreground" />
          </div>
          <div className="absolute top-40 right-20 animate-float opacity-15">
            <TreeDeciduous className="w-32 h-32 text-primary-foreground" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-float opacity-10">
            <TreePine className="w-40 h-40 text-primary-foreground" />
          </div>
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border text-primary-foreground text-sm mb-6">
              <TreePine className="w-4 h-4" />
              {heroSettings.badge_text}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              {heroSettings.title_line1}
              <span className="block text-primary-foreground/90">
                {heroSettings.title_line2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              {heroSettings.description}
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 rounded-full shadow-xl hover:scale-105 transition"
                >
                  <ClipboardList className="w-5 h-5 mr-2" />
                  {heroSettings.button_text}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <TreeForm />
              </DialogContent>
            </Dialog>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 max-w-2xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-primary-foreground/10 border backdrop-blur"
                >
                  <div className="text-3xl font-bold text-primary-foreground">
                    {heroSettings[`stat${i}_value` as keyof HeroSettings]}
                  </div>
                  <div className="text-sm text-primary-foreground/70">
                    {heroSettings[`stat${i}_label` as keyof HeroSettings]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= IMAGE CARD (GAMBAR KEDUA) ================= */}
      {heroSettings.secondary_image_type !== "none" && heroSettings.secondary_image_url && (
        <section className="py-12 md:py-20 lg:py-24 bg-gradient-nature">
          <div className="container px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              {(heroSettings.secondary_image_title || heroSettings.secondary_image_description) && (
                <div className="text-center mb-8 md:mb-12">
                  {heroSettings.secondary_image_title && (
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                      {heroSettings.secondary_image_title}
                    </h2>
                  )}
                  {heroSettings.secondary_image_description && (
                    <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto">
                      {heroSettings.secondary_image_description}
                    </p>
                  )}
                </div>
              )}

              {/* Image Container */}
              <div className="relative group">
                {/* Decorative background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl md:rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Main card */}
                <div className="relative bg-card rounded-xl md:rounded-2xl lg:rounded-3xl shadow-elevated border border-border/50 overflow-hidden">
                  {/* Image wrapper with aspect ratio */}
                  <div className="relative w-full">
                    <img
                      src={heroSettings.secondary_image_url}
                      alt={heroSettings.secondary_image_title || "Visual Program"}
                      className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[75vh] object-contain bg-muted/30"
                    />
                    
                    {/* Subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-primary/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-primary/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSection;