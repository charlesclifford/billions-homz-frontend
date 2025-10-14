import MobileTabNav from "@/components/profile/MobileTabNav";
import UserProfileSidebar from "@/components/profile/UserProfileSidebar";
import Logo from "@/components/shared/Logo";
import { ThemeToggler } from "@/components/shared/ThemeToggler";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen bg-background")}>
      {/* Top Bar */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Logo className="h-8" />
            </Link>
            <div className="h-6 w-px bg-border hidden md:block" />
            <span className="text-muted-foreground text-sm hidden md:inline">
              My Account
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
            >
              <Link href="/listings/properties">Browse Properties</Link>
            </Button>
            <ThemeToggler />
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="container px-4 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation - Desktop */}
          <aside className="lg:col-span-3 hidden lg:block">
            <UserProfileSidebar />
          </aside>

          {/* Mobile Navigation */}
          <MobileTabNav />

          {/* Content Area */}
          <main className="lg:col-span-9 pb-16">{children}</main>
        </div>
      </div>
    </div>
  );
}
