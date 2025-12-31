import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TreePine, 
  Users, 
  Building2, 
  LogOut, 
  Loader2, 
  Settings,
  TrendingUp,
  Target,
  BarChart3
} from "lucide-react";
import OPDSettings from "@/components/admin/OPDSettings";
import TreeRegistrationsList from "@/components/admin/TreeRegistrationsList";
import DashboardStats from "@/components/admin/DashboardStats";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();

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

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - Bank Data Pohon</title>
        <meta name="description" content="Dashboard admin untuk mengelola data pohon" />
      </Helmet>

      <div className="min-h-screen bg-gradient-nature">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Bank Data Pohon</h1>
                <p className="text-sm text-muted-foreground">Dashboard Admin</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.email}
              </span>
              {isAdmin && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="bg-card/80 backdrop-blur-sm p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="registrations" className="flex items-center gap-2">
                <TreePine className="w-4 h-4" />
                <span className="hidden sm:inline">Data Pohon</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Pengaturan OPD</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardStats />
            </TabsContent>

            <TabsContent value="registrations">
              <TreeRegistrationsList />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="settings">
                <OPDSettings />
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Admin;
