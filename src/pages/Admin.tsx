import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layouts/AdminLayout";

import DashboardStats from "@/components/admin/DashboardStats";
import TreeRegistrationsList from "@/components/admin/TreeRegistrationsList";
import HeroSettings from "@/components/admin/HeroSettings";
import LogoSettings from "@/components/admin/LogoSettings";
import GlobalSettings from "@/components/admin/GlobalSettings";
import OPDSettings from "@/components/admin/OPDSettings";
import KontribusiOpd from "@/pages/KontribusiOpd";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;

      case "registrations":
        return <TreeRegistrationsList />;

      case "hero-settings":
        return isAdmin ? <HeroSettings /> : null;

      case "logo-settings":
        return isAdmin ? <LogoSettings /> : null;

      case "global-settings":
        return isAdmin ? <GlobalSettings /> : null;

      case "opd-contribution":
        return isAdmin ? <KontribusiOpd /> : null;

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
        <meta
          name="description"
          content="Dashboard admin untuk mengelola data pohon"
        />
      </Helmet>

      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </AdminLayout>

    </>
  );
};

export default Admin;
