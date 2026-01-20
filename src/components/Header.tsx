import { Link } from "react-router-dom";
import { TreePine, LogIn, UserPlus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LogoSettings {
  logo_url: string;
  logo_type: "default" | "url" | "upload";
  site_name: string;
  site_subtitle: string;
}

const Header = () => {
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

        {/* Sidebar trigger + Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden p-2">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          <Link to="/" className="flex items-center gap-3">
            {logoType !== "default" && logoUrl ? (
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-primary/20 bg-white">
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-full">
                <TreePine className="w-5 h-5 text-primary-foreground" />
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
              className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Tombol kanan */}
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button className="rounded-full">
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Partisipasi</span>
            </Button>
          </Link>

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
