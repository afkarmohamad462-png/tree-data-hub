import React from "react";
import {
  BarChart3,
  TreePine,
  Sliders,
  Settings,
  Image,
  Users,
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
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    isActive={activeTab === item.id}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MENU ADMIN */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Pengaturan Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      isActive={activeTab === item.id}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
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
