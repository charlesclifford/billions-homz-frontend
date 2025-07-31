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
    <div>
      <div>{children}</div>
    </div>
  );
}
