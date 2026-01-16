import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  TreePine, 
  LogOut, 
  Loader2, 
  Menu
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OPDSettings from "@/components/admin/OPDSettings";
import TreeRegistrationsList from "@/components/admin/TreeRegistrationsList";
import DashboardStats from "@/components/admin/DashboardStats";
import GlobalSettings from "@/components/admin/GlobalSettings";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "registrations":
        return <TreeRegistrationsList />;
      case "global-settings":
        return isAdmin ? <GlobalSettings /> : null;
      case "settings":
        return isAdmin ? <OPDSettings /> : null;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - Bank Data Pohon</title>
        <meta name="description" content="Dashboard admin untuk mengelola data pohon" />
      </Helmet>

      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-gradient-nature">
          {/* Sidebar */}
          <AdminSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            isAdmin={isAdmin} 
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </SidebarTrigger>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TreePine className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-foreground">Bank Data Pohon</h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">Dashboard Admin</p>
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

            {/* Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto">
              {renderContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Admin;
