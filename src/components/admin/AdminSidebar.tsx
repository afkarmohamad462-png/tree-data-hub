import { BarChart3, TreePine, Sliders, Settings, Image } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

const AdminSidebar = ({ activeTab, onTabChange, isAdmin }: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: BarChart3 },
    { id: "registrations", title: "Data Pohon", icon: TreePine },
  ];

  const adminMenuItems = [
    { id: "hero-settings", title: "Pengaturan Hero", icon: Image },
    { id: "global-settings", title: "Pengaturan Tampilan", icon: Sliders },
    { id: "settings", title: "Pengaturan OPD", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Pengaturan Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className="cursor-pointer"
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
};

export default AdminSidebar;
