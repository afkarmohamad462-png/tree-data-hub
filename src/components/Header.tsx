import { Link } from "react-router-dom";
import { TreePine, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  return (
    <header className="w-full bg-transparent py-4 z-30">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/10 rounded-xl">
            <TreePine className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-semibold text-primary-foreground">Bank Data Pohon</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
            activeClassName="text-primary-foreground font-semibold"
          >
            Beranda
          </NavLink>
          <NavLink
            to="/about"
            className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
            activeClassName="text-primary-foreground font-semibold"
          >
            Tentang
          </NavLink>

          <Link to="/auth">
            <Button variant="outline" size="sm" className="ml-2">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
