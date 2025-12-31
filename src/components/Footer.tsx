import { TreePine, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-forest-dark text-primary-foreground py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Bank Data Pohon</h3>
              <p className="text-sm text-primary-foreground/70">Sistem Pendataan Pohon</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <span>Dibuat dengan</span>
            <Heart className="w-4 h-4 fill-current text-amber" />
            <span>untuk kelestarian lingkungan</span>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Bank Data Pohon. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
