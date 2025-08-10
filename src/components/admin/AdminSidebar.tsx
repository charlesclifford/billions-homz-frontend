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
  ShoppingCartIcon,
  UserCog2Icon,
  Users2Icon,
  WalletIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../shared/Logo";
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
    title: "Estates",
    url: "/admin/estates",
    icon: HomeIcon,
  },
  // {
  //   title: "Properties",
  //   url: "/admin/properties",
  //   icon: HomeIcon,
  // },
  {
    title: "Sales",
    url: "/admin/sales",
    icon: ShoppingCartIcon,
  },
  {
    title: "Commissions",
    url: "/admin/commissions",
    icon: WalletIcon,
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
    // Exact match
    if (pathname === itemUrl) return true;

    // Special case for "/admin" to prevent matching all admin routes
    if (itemUrl === "/admin") {
      return pathname === "/admin";
    }

    // Match parent routes and their nested routes
    return pathname.startsWith(`${itemUrl}/`) || pathname === itemUrl;
  };

  const userRole = user?.role;

  const filteredMenu = navMain.filter(
    (nav) => !nav.roles || (userRole && nav.roles.includes(userRole))
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-2 border-b min-h-[64px] flex items-center justify-center">
        <div className="flex items-center py-1">
          <Link href="/" className="flex items-center ">
            <div
              className={cn(
                "aspect-square transition-all duration-200",
                "group-data-[collapsible=icon]:block",
                "group-data-[collapsible=icon]:w-8",
                "group-data-[state=expanded]:hidden",
                "hidden md:block"
              )}
            >
              <Image
                src={"/logos/b-t.png"}
                alt="logo"
                width={300}
                height={150}
                className="object-contain w-full h-full"
              />
            </div>
            <Logo
              className={cn(
                "h-10 transition-all duration-200",
                "group-data-[collapsible=icon]:hidden",
                "group-data-[state=expanded]:block"
              )}
            />
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
