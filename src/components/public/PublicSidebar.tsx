import { Home, Info, Building2, Map, Image, BookOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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

const menuItems = [
  { title: "Beranda", to: "/", icon: Home },
  { title: "Tentang", to: "/about", icon: Info },
  { title: "Kontribusi OPD", to: "/opd", icon: Building2 },
  { title: "Peta Penanaman", to: "/map", icon: Map },
  { title: "Galeri", to: "/gallery", icon: Image },
  { title: "Edukasi", to: "/education", icon: BookOpen },
];

const PublicSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      activeClassName="bg-emerald-100 text-emerald-700 font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default PublicSidebar;
