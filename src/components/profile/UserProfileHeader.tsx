"use client";
import Link from "next/link";
import React from "react";
import Logo from "../shared/Logo";
import { Button } from "../ui/button";
import { ThemeToggler } from "../shared/ThemeToggler";
import useLogout from "@/hooks/useLogout";
import { LogOut } from "lucide-react";

const UserProfileHeader = () => {
  const { signOut, isLoggingOut } = useLogout();

  return (
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
          <ThemeToggler />
          <Button
            variant="destructive"
            size="icon"
            className="flex lg:hidden"
            disabled={isLoggingOut}
            onClick={signOut}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UserProfileHeader;
