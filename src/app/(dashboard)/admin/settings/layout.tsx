import SettingsNav from "@/components/admin/settings/SettingsNav";
import { Separator } from "@/components/ui/separator";
import { SettingsIcon } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <div className="border border-primary/20 bg-primary/10 p-3 rounded-full">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-primary text-2xl md:text-3xl font-semibold">
            Settings
          </h2>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <SettingsNav />
        <main className="flex-1 lg:max-w-2xl">{children}</main>
      </div>
    </div>
  );
}
