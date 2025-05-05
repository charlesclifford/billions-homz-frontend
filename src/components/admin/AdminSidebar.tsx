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
// import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

interface ISidebarMenu {
  title: string;
  url: string;
  roles?: string[];
  icon?: React.ComponentType<{ size?: number; className?: string }>;
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

  const filteredMenu = items.filter(
    (nav) => !nav.roles || (userRole && nav.roles.includes(userRole))
  );

  return (
    <Sidebar className="">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center py-2">
          <Link href="/" className="text-xl flex items-center">
            {/* <div className="lg:h-[35px] h-[30px] px-2 ">
              <Image
                src="/images/logos/gph-logo-full-black.png"
                alt="logo"
                width={300}
                height={200}
                className="w-full h-full object-contain"
              />
            </div> */}
            Billions Homz
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
                  isActive={isItemActive(item.url)}
                  className="w-full justify-start"
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
      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant={"ghost"}
              className="w-full justify-start gap-2 text-destructive hover:text-destructive cursor-pointer"
              disabled={isLoggingOut}
              onClick={signOut}
            >
              <LogOutIcon size={16} />
              <span>Sign Out</span>
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
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
