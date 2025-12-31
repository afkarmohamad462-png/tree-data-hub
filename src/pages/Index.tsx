import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import TreeForm from "@/components/TreeForm";
import Footer from "@/components/Footer";

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
        
        <main className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <TreeForm />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
