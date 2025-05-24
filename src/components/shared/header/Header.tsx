"use client";

import { useAppSelector } from "@/store/hooks";
import { ThemeToggler } from "../ThemeToggler";
import HeaderUser from "./HeaderUser";
import { menuList } from "./menu";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import NavLinks from "./NavLinks";

const Header = () => {
  const { loading } = useAppSelector((state) => state.auth);

  return (
    <div className="fixed top-0 z-10 w-full">
      <div className="container mx-auto px-4">
        <div className="py-7 w-full">
          <div className="bg-background backdrop-blur-[60px] rounded-[100px] grid grid-cols-5 items-center px-4 border border-neutral-300/50">
            {/* Logo */}
            <div className="col-span-1">
              <Link href="/" className="text-xl flex items-center gap-1 ">
                <Avatar
                  className={cn(
                    "size-10 transition-all duration-200",
                    "group-data-[collapsible=icon]:size-8", // Smaller when collapsed
                    "group-data-[collapsible=icon]:mx-auto" // Center when collapsed
                  )}
                >
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    BH
                  </AvatarFallback>
                </Avatar>

                <span
                  className={cn(
                    "text-lg font-semibold whitespace-nowrap transition-opacity duration-200",
                    "group-data-[collapsible=icon]:hidden" // Hide text when collapsed
                  )}
                >
                  Billions Homz
                </span>
              </Link>
            </div>

            {/* navlinks */}
            <div className="col-span-3 flex justify-center">
              <NavLinks items={menuList} />
            </div>

            <div className="pr-2 col-span-1 flex items-center justify-end gap-2">
              <div className="flex items-center">
                {loading ? (
                  <Skeleton className="size-8 rounded-full" />
                ) : (
                  <HeaderUser />
                )}
              </div>
              <ThemeToggler />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
