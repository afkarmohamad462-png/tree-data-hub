import { Link } from "react-router-dom";
import { TreePine, LogIn, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useSidebar } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LogoSettings {
  logo_url: string;
  logo_type: "default" | "url" | "upload";
  site_name: string;
  site_subtitle: string;
}

const Header = () => {
  const { toggleSidebar } = useSidebar();

  const { data: logoSettings } = useQuery({
    queryKey: ["logo-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "logo")
        .maybeSingle();

      if (error) throw error;
      return data?.value as unknown as LogoSettings | null;
    },
  });

  const siteName = logoSettings?.site_name || "Program Agro Mopomulo";
  const siteSubtitle = logoSettings?.site_subtitle || "Kabupaten Gorontalo Utara";
  const logoUrl = logoSettings?.logo_url;
  const logoType = logoSettings?.logo_type || "default";

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between py-3">

        {/* Hamburger + Logo */}
        <div className="flex items-center gap-3">

          {/* Hamburger 3 garis FIX */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-muted transition"
            aria-label="Toggle menu"
          >
            <AlignJustify className="w-7 h-7" strokeWidth={2.5} />
          </button>

          <Link to="/" className="flex items-center gap-3">
            {logoType !== "default" && logoUrl ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border-2 border-primary/20 bg-white">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-primary rounded-full">
                <TreePine className="w-6 h-6 text-primary-foreground" />
              </div>
            )}

            <div className="leading-tight">
              <p className="font-semibold text-sm">{siteName}</p>
              <p className="text-xs text-muted-foreground">{siteSubtitle}</p>
            </div>
          </Link>
        </div>

        {/* Menu tengah */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Beranda", to: "/" },
            { label: "Tentang", to: "/about" },
            { label: "Kontribusi OPD", to: "/opd" },
            { label: "Peta Penanaman", to: "/map" },
            { label: "Galeri", to: "/gallery" },
            { label: "Edukasi", to: "/education" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground"
              activeClassName="bg-primary/10 text-primary font-semibold"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Tombol kanan */}
        <div className="flex items-center gap-3">
          <Link to="/admin">
            <Button variant="outline" className="rounded-full">
              <LogIn className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
