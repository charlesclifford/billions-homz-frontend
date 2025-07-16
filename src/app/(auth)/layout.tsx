import Logo from "@/components/shared/Logo";
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
            <Link href="/" className="flex items-center">
              <Logo className="h-8" />
            </Link>
          </div>
          {children}
        </div>
        <div className="hidden lg:block col-span-1 bg-primary w-full h-dvh"></div>
      </div>
    </div>
  );
}
