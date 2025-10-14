import MobileTabNav from "@/components/profile/MobileTabNav";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import UserProfileSidebar from "@/components/profile/UserProfileSidebar";
import { cn } from "@/lib/utils";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen bg-background")}>
      {/* Top Bar */}
      <UserProfileHeader />

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
