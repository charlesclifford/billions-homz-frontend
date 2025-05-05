"use client";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/store/hooks";
import {
  CircleGaugeIcon,
  HomeIcon,
  KeyRoundIcon,
  LogOutIcon,
  SettingsIcon,
  UserCogIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";

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
    icon: UserCogIcon,
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
  // {
  //   title: "Gallery",
  //   url: "/admin/gallery",
  //   icon: ImageIcon,
  //   roles: ["super_admin"],
  // },
  // {
  //   title: "Blogs",
  //   url: "/admin/blogs",
  //   // icon: ,
  //   roles: ["super_admin"],
  // },
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
  const { signOut, isLoggingOut } = useLogout();
  const { user } = useAppSelector((state) => state.auth);

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
    <Sidebar className="" collapsible="icon">
      <SidebarHeader className="px-4 py-2 border-b">
        <div className="flex items-center py-2 ">
          <Link href="/" className="text-xl flex items-center">
            <Avatar className="size-12 mr-2">
              <AvatarFallback className="bg-primary/10 text-primary">
                BH
              </AvatarFallback>
            </Avatar>

            <span>Billions Homz</span>
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
        <SidebarMenu className="">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full justify-start text-destructive hover:text-destructive px-4 py-2 cursor-pointer"
              disabled={isLoggingOut}
              tooltip={"Sign Out"}
              onClick={signOut}
            >
              <LogOutIcon size={18} className="mr-2" />
              <span className="sidebar-collapsed:hidden">Sign Out</span>
              {isLoggingOut && (
                <span className="ml-auto">
                  <svg
                    className="animate-spin h-4 w-4 text-destructive"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
