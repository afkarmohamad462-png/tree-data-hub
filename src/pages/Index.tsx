import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { TreePine, Leaf, Users, Award } from "lucide-react";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Bank Data Pohon - Sistem Pendataan Pohon</title>
        <meta 
          name="description" 
          content="Sistem pendataan pohon untuk mendukung program penghijauan dan pelestarian lingkungan. Daftarkan data pohon Anda sekarang." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-nature">
        <HeroSection />
        
        {/* Features Section */}
        <main className="container py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mengapa Bank Data Pohon?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform digital untuk mencatat dan memantau pertumbuhan pohon di daerah Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center hover:shadow-elevated transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TreePine className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Pendataan Mudah</h3>
              <p className="text-muted-foreground">
                Daftarkan data pohon dengan mudah melalui form digital yang terintegrasi dengan GPS
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center hover:shadow-elevated transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Kolaborasi OPD</h3>
              <p className="text-muted-foreground">
                Berbagai OPD dapat berpartisipasi dalam program penghijauan secara terkoordinasi
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center hover:shadow-elevated transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Laporan Akurat</h3>
              <p className="text-muted-foreground">
                Dapatkan laporan dan statistik pohon yang tercatat secara real-time dan akurat
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Leaf className="w-4 h-4" />
              Mari Bersama Menjaga Bumi
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
