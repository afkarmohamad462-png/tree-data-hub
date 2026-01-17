import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";

import Header from "@/components/Header";

// Pages utama
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Pages tambahan sesuai menu header
import Opd from "./pages/Opd";
import MapPage from "./pages/MapPage";
import Gallery from "./pages/Gallery";
import Education from "./pages/Education";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            {/* Header selalu tampil */}
            <Header />

            {/* Halaman yang berubah */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/opd" element={<Opd />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/education" element={<Education />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
