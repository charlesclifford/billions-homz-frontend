"use client";
import React, { useMemo } from "react";
import { ThemeToggler } from "../ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import useLogout from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { signOut, isLoggingOut } = useLogout();
  const { user, loading } = useAppSelector((state) => state.auth);

  const userName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Guest"),
    [user]
  );

  const userRole = useMemo(
    () => (user?.role ? formatText(user.role).toLowerCase() : "unknown role"),
    [user]
  );

  return (
    <div className="sticky top-0 z-10 w-full bg-background border-b border-gray-200 dark:border-neutral-700">
      <div className="flex w-full h-[60px] items-center px-3 bg-inherit border-b border-gray-200 dark:border-neutral-700">
        <Button
          variant={"destructive"}
          className="px-4 py-2 bg-red-500 text-white"
          disabled={isLoggingOut}
          onClick={signOut}
        >
          Sign out
        </Button>
        <div className="ml-auto pr-2 flex items-center gap-2">
          <ThemeToggler />
          <div className="flex items-center">
            {loading ? (
              "loading..."
            ) : (
              <>
                <Avatar className="size-10">
                  <AvatarImage src={user?.avatar} alt="avatar" />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-2">
                  <span className="font-semibold text-sm">{userName}</span>
                  <span className="text-xs capitalize">{userRole}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
