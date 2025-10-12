"use client";

import { cn } from "@/lib/utils";
import {
  CircleGaugeIcon,
  FileText,
  HandCoinsIcon,
  Settings,
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
import RealtorSidebarUser from "./RealtorSidebarUser";
import { useAppSelector } from "@/store/hooks";

interface ISidebarMenu {
  title: string;
  url: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const navMain: ISidebarMenu[] = [
  {
    title: "Dashboard",
    url: "/realtor/dashboard",
    icon: CircleGaugeIcon,
  },
  {
    title: "Sales",
    url: "/realtor/sales",
    icon: FileText,
  },
  // {
  //   title: "Client Inquiries",
  //   url: "/realtor/inquiries",
  //   icon: MailIcon,
  // },
  {
    title: "Commissions",
    url: "/realtor/commissions",
    icon: HandCoinsIcon,
  },
  // {
  //   title: "Earnings",
  //   url: "/realtor/earnings",
  //   icon: WalletIcon,
  // },
];

const navSecondary: ISidebarMenu[] = [
  {
    title: "Settings",
    url: "/realtor/settings",
    icon: Settings,
  },
];

const RealtorSidebar = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useAppSelector((state) => state.auth);

  const isProfileComplete = user?.isProfileComplete;

  const isItemActive = (itemUrl: string) => pathname.startsWith(itemUrl);

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
        {isProfileComplete && (
          <SidebarMenu className="space-y-1 p-2">
            {navMain.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item.url)}
                  tooltip={item.title}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link
                    href={item.url}
                    className="h-full w-full flex items-center px-4 py-2 relative"
                  >
                    {item.icon && <item.icon size={18} className="mr-2" />}
                    <span className="sidebar-collapsed:hidden text-nowrap">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}

        <SidebarMenu className="space-y-1 p-2 border-t">
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={isItemActive(item.url)}
                tooltip={item.title}
                onClick={() => setOpenMobile(false)}
              >
                <Link
                  href={item.url}
                  className="h-full w-full flex items-center px-4 py-2"
                >
                  {item.icon && <item.icon size={18} className="mr-2" />}
                  <span className="sidebar-collapsed:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        <RealtorSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default RealtorSidebar;
