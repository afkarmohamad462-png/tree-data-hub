import { TreePine, Leaf, TreeDeciduous, LogIn, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import heroForest from "@/assets/hero-forest.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import TreeForm from "@/components/TreeForm";

const HeroSection = () => {
  return (
    <section className="relative min-h-[50vh] overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroForest} 
          alt="Forest background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating leaves */}
        <div className="absolute top-20 left-10 animate-float opacity-20">
          <Leaf className="w-24 h-24 text-primary-foreground" />
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-15" style={{ animationDelay: "1s" }}>
          <TreeDeciduous className="w-32 h-32 text-primary-foreground" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float opacity-10" style={{ animationDelay: "2s" }}>
          <TreePine className="w-40 h-40 text-primary-foreground" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float opacity-15" style={{ animationDelay: "1.5s" }}>
          <Leaf className="w-16 h-16 text-primary-foreground rotate-45" />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        {/* Admin Login Button */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <Link to="/auth">
            <Button variant="outline" size="sm" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <LogIn className="w-4 h-4 mr-2" />
              Login Admin
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
            <TreePine className="w-4 h-4" />
            Sistem Pendataan Pohon
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Bank Data
            <span className="block text-primary-foreground/90">Pohon</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Sistem pendataan pohon untuk mendukung program penghijauan dan 
            pelestarian lingkungan. Mari bersama menjaga bumi untuk generasi mendatang.
          </p>

          {/* CTA Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                Form Pendataan Pohon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
              <TreeForm />
            </DialogContent>
          </Dialog>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">10K+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Pohon Tercatat</div>
            </div>
            <div className="p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">50+</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Jenis Pohon</div>
            </div>
            <div className="p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">25</div>
              <div className="text-sm text-primary-foreground/70 mt-1">OPD Terlibat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
