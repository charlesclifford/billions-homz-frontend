import { Metadata } from "next";
import { config } from "@/utils/config";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";
import "react-quill-new/dist/quill.snow.css";

const { SITE_NAME } = config;

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: `%s | Admin | ${SITE_NAME}`,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="relative w-full min-h-dvh flex flex-col">
        <AdminHeader />
        <div className="w-full flex-1 px-4 lg:px-8 py-8 container mx-auto">
          {children}
        </div>
        <AdminFooter />
      </main>
    </SidebarProvider>
  );
}
