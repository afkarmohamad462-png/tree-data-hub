import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import PublicSidebar from "@/components/public/PublicSidebar";
import Footer from "@/components/Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1">
          {/* Sidebar hanya untuk mobile */}
          <div className="md:hidden">
            <PublicSidebar />
          </div>
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default PublicLayout;
