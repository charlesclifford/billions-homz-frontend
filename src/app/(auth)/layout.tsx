import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-dvh">
      <div className="grid grid-cols-2">
        <div className="col-span-2 lg:col-span-1 h-dvh overflow-y-auto px-4">
          <div className="h-[80px] flex items-center">
            <Link href="/" className="text-xl flex items-center gap-1">
              <Avatar
                className={cn(
                  "transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                  "size-10",
                  "group-data-[collapsible=icon]:size-8",
                  "group-data-[collapsible=icon]:mx-auto"
                )}
              >
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  BH
                </AvatarFallback>
              </Avatar>

              <span
                className={cn(
                  "text-lg font-semibold whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                  "group-data-[collapsible=icon]:hidden"
                )}
              >
                Billions Homz
              </span>
            </Link>
          </div>
          {children}
        </div>
        <div className="hidden lg:block col-span-1 bg-primary w-full h-dvh"></div>
      </div>
    </div>
  );
}
