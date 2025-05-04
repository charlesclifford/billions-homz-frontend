"use client";
import {
  CircleGaugeIcon,
  HomeIcon,
  LucideIcon,
  Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/store/hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Button } from "../ui/button";

interface ISidebarMenu {
  title: string;
  url: string;
  roles?: string[];
  icon?: LucideIcon;
}

const items: ISidebarMenu[] = [
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
    icon: Users2Icon,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users2Icon,
    // roles: ["SUPER_ADMIN"],
  },
  {
    title: "Admins",
    url: "/admin/admin-users",
    icon: Users2Icon,
    roles: ["SUPER_ADMIN"],
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

  const filteredMenu = items.filter(
    (nav) => !nav.roles || nav.roles.includes(userRole!)
  );

  return (
    <Sidebar className="">
      <SidebarHeader>
        <div className="flex items-center py-2">
          <Link href="/" className="text-xl">
            <div className="lg:h-[35px] h-[30px] px-2 ">
              <Image
                src="/images/logos/gph-logo-full-black.png"
                alt="logo"
                width={300}
                height={200}
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="py-4 px-2">
          {filteredMenu.map((item, i) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  isActive={isItemActive(item.url)}
                  className="p-0"
                >
                  <Link
                    href={item.url}
                    className="h-full w-full flex items-center px-4 py-2"
                  >
                    {Icon && <Icon size={18} className="mr-2" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant={"destructive"}
              className="px-4 py-2 bg-red-500 text-white"
              disabled={isLoggingOut}
              onClick={signOut}
            >
              Sign out
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
