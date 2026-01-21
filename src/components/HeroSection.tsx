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
      return data?.value as unknown as HeroSettings;
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

      {/* ================= IMAGE CARD (TIDAK TERPOTONG) ================= */}
      {heroSettings.image_url && (
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border p-6">
                <div className="flex justify-center items-center bg-muted rounded-2xl p-4">
                  <img
                    src={heroSettings.image_url}
                    alt="Visual Program"
                    className="max-h-[70vh] max-w-full w-auto object-contain"
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-semibold">
                    Dokumentasi Program Agro Mopomulo
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSection;