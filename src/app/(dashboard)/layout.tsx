import { Metadata } from "next";
import { config } from "@/utils/config";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";
import "react-quill-new/dist/quill.snow.css";
import 'highlight.js/styles/github.css'; 

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
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
        <AdminFooter />
      </main>
    </SidebarProvider>
  );
}
