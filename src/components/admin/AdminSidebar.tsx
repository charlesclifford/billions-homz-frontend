"use client";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import {
  BellIcon,
  CircleGaugeIcon,
  HomeIcon,
  ImageIcon,
  KeyRoundIcon,
  NewspaperIcon,
  SettingsIcon,
  UserCog2Icon,
  Users2Icon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import AdminSidebarUser from "./AdminSidebarUser";

interface ISidebarMenu {
  title: string;
  url: string;
  roles?: string[];
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const navMain: ISidebarMenu[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: CircleGaugeIcon,
  },
  {
    title: "Properties",
    url: "/admin/properties",
    icon: HomeIcon,
  },
  {
    title: "Realtors",
    url: "/admin/realtors",
    icon: UserCog2Icon,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users2Icon,
    roles: ["admin", "super_admin"],
  },
  {
    title: "Admins",
    url: "/admin/members",
    icon: KeyRoundIcon,
    roles: ["super_admin"],
  },
  {
    title: "Gallery",
    url: "/admin/gallery",
    icon: ImageIcon,
    roles: ["super_admin"],
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: NewspaperIcon,
    roles: ["super_admin"],
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: BellIcon,
  },
];

const navSecondary: ISidebarMenu[] = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: SettingsIcon,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { setOpenMobile } = useSidebar();

  const isItemActive = (itemUrl: string) => {
    if (pathname === itemUrl) return true; // Exact match first
    return (
      pathname.startsWith(itemUrl) &&
      pathname.split("/").length === itemUrl.split("/").length
    );
  };

  const userRole = user?.role;

  const filteredMenu = navMain.filter(
    (nav) => !nav.roles || (userRole && nav.roles.includes(userRole))
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-2 border-b">
        <div className="flex items-center py-1">
          <Link href="/" className="text-xl flex items-center gap-1 ">
            <Avatar
              className={cn(
                "size-10 transition-all duration-200",
                "group-data-[collapsible=icon]:size-8", // Smaller when collapsed
                "group-data-[collapsible=icon]:mx-auto" // Center when collapsed
              )}
            >
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                BH
              </AvatarFallback>
            </Avatar>

            <span
              className={cn(
                "text-lg font-semibold whitespace-nowrap transition-opacity duration-200",
                "group-data-[collapsible=icon]:hidden" // Hide text when collapsed
              )}
            >
              Billions Homz
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu className="space-y-1 p-2">
          {filteredMenu.map((item, i) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item.url)}
                  className="w-full justify-start"
                  tooltip={item.title}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link
                    href={item.url}
                    className="h-full w-full flex items-center px-4 py-2"
                  >
                    {Icon && <Icon size={18} className="mr-2" />}
                    <span className="sidebar-collapsed:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <SidebarMenu className="space-y-1 p-2 mt-auto">
          {navSecondary.map((item, i) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item.url)}
                  className="w-full justify-start"
                  tooltip={item.title}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link
                    href={item.url}
                    className="h-full w-full flex items-center px-4 py-2"
                  >
                    {Icon && <Icon size={18} className="mr-2" />}
                    <span className="sidebar-collapsed:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <AdminSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
