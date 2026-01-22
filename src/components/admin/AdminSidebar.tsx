import React from "react";
import {
  BarChart3,
  TreePine,
  Sliders,
  Settings,
  Image,
  Users,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

type MenuItem = {
  id: string;
  title: string;
  icon: React.ElementType;
};

export default function AdminSidebar({
  activeTab,
  onTabChange,
  isAdmin,
}: AdminSidebarProps) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  // handler klik menu - auto close di semua device
  const handleMenuClick = (tab: string) => {
    onTabChange(tab);
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: BarChart3,
    },
    {
      id: "registrations",
      title: "Data Pohon",
      icon: TreePine,
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      id: "hero-settings",
      title: "Pengaturan Hero",
      icon: Image,
    },
    {
      id: "logo-settings",
      title: "Pengaturan Logo",
      icon: Shield,
    },
    {
      id: "global-settings",
      title: "Pengaturan Tampilan",
      icon: Sliders,
    },
    {
      id: "opd-contribution",
      title: "Kontribusi OPD",
      icon: Users,
    },
    {
      id: "settings",
      title: "Pengaturan OPD",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        {/* MENU UTAMA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground mb-2">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    isActive={activeTab === item.id}
                    className="py-3 text-base"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-base font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MENU ADMIN */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground mb-2">
              Pengaturan Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      isActive={activeTab === item.id}
                      className="py-3 text-base"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-base font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
