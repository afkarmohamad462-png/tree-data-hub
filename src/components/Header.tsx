import { Link } from "react-router-dom";
import { TreePine, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between py-3">

        {/* Logo kiri */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-emerald-600 rounded-full">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm">Program Agro Mopomulo</p>
            <p className="text-xs text-muted-foreground">Kabupaten Gorontalo Utara</p>
          </div>
        </Link>

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
              className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black"
              activeClassName="bg-emerald-100 text-emerald-700 font-medium"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Tombol kanan */}
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Partisipasi
            </Button>
          </Link>

          <Link to="/admin">
            <Button variant="outline" className="rounded-full">
              <LogIn className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
