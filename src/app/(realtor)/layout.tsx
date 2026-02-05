import RealtorHeader from "@/components/realtor/RealtorHeader";
import RealtorSidebar from "@/components/realtor/RealtorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { config } from "@/utils/config";
import { Metadata } from "next";

const { SITE_NAME } = config;

export const metadata: Metadata = {
  title: {
    default: "Realtor",
    template: `%s | Realtor | ${SITE_NAME}`,
  },
};

export default async function RealtorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <RealtorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <RealtorHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
