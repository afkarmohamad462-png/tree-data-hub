import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";

import PublicLayout from "@/components/layouts/PublicLayout";

// Pages utama
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Pages tambahan sesuai menu header
import Opd from "./pages/KontribusiOpd";
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
            <Routes>
              {/* Public pages dengan PublicLayout */}
              <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/opd" element={<PublicLayout><Opd /></PublicLayout>} />
              <Route path="/map" element={<PublicLayout><MapPage /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
              <Route path="/education" element={<PublicLayout><Education /></PublicLayout>} />
              <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
              
              {/* Admin page dengan layout sendiri */}
              <Route path="/admin" element={<Admin />} />
              
              {/* 404 */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
