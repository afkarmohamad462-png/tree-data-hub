import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { TreePine, LogOut, Loader2, Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminLayout = ({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const isMobile = useIsMobile();

  /**
   * 🔑 CONTROLLED SIDEBAR STATE
   */
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  /**
   * Saat pindah desktop ↔ mobile
   * - mobile: sidebar default tertutup
   * - desktop: sidebar terbuka
   */
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-nature">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full bg-gradient-nature">
        {/* SIDEBAR */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isAdmin={isAdmin}
        />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER */}
          <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* TOGGLE SIDEBAR (MOBILE) */}
                <SidebarTrigger className="md:hidden">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>

                <div className="p-2 bg-primary/10 rounded-lg">
                  <TreePine className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <h1 className="font-bold text-lg text-foreground">
                    Bank Data Pohon
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Dashboard Admin
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.email}
                </span>

                {isAdmin && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hidden sm:inline">
                    Admin
                  </span>
                )}

                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Keluar</span>
                </Button>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
