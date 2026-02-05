"use client";
import useLogout from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import {
  Heart,
  LogOut,
  Settings,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserProfileSidebar = () => {
  const pathname = usePathname();
  const { signOut, isLoggingOut } = useLogout();

  const navItems = [
    { href: "/profile", label: "Overview", icon: User },
    {
      href: "/profile/favorites",
      label: "Favorites",
      icon: Heart,
    },
    // { href: "/profile/inspections", label: "My Inspections", icon: Clock },
    // { href: "/profile/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/profile/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="sticky top-24 space-y-2">
      <nav className="space-y-1 bg-card rounded-xl border p-2 shadow-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="pt-2 mt-2 border-t">
          <button
            disabled={isLoggingOut}
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default UserProfileSidebar;
