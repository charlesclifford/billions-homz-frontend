"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Profile", href: "/admin/settings" },
  { name: "Commission", href: "/admin/settings/commissions" },
  { name: "Security", href: "/admin/settings/security" },
];

const SettingsNav = () => {
  const pathname = usePathname();

  const isItemActive = (itemUrl: string) => {
    if (pathname === itemUrl) return true; // Exact match first
    return (
      pathname.startsWith(itemUrl) &&
      pathname.split("/").length === itemUrl.split("/").length
    );
  };
  return (
    <aside className="lg:w-1/5">
      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        <SidebarMenu className="space-y-1">
          {tabs.map((tab) => (
            <SidebarMenuItem key={tab.name}>
              <SidebarMenuButton asChild isActive={isItemActive(tab.href)}>
                <Link href={tab.href}>{tab.name}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
    </aside>
  );
};

export default SettingsNav;
