"use client";
import { cn } from "@/lib/utils";
import { Clock, Heart, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const MobileTabNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/profile", label: "Overview", icon: User },
    {
      href: "/profile/favorites",
      label: "Favorites",
      icon: Heart,
    },
    { href: "/profile/inspections", label: "My Inspections", icon: Clock },
    // { href: "/profile/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/profile/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <nav className="w-full container mx-auto px-2 grid grid-cols-4 gap-2 py-3">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-5 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              />
              <span className="text-xs font-medium text-center hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileTabNav;
