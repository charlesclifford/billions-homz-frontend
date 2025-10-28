import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";

const HeaderUser = () => {
  const { signOut, isLoggingOut } = useLogout();
  const { user } = useAppSelector((state) => state.auth);

  const userName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Guest"),
    [user]
  );

  const userRole = useMemo(
    () => (user?.role ? formatText(user.role).toLowerCase() : "unknown role"),
    [user]
  );

  const dropdownMenuList = [
    {
      name: "Dashboard",
      href: "/admin",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Dashboard",
      href: "/realtor/dashboard",
      roles: ["realtor"],
    },
    {
      name: "Profile",
      href: "/profile",
    },
    {
      name: "Favorites",
      href: "/profile/favorites",
    },
  ];

  const filteredMenu = dropdownMenuList.filter(
    (nav) =>
      !nav.roles || (userRole && nav.roles.includes(user?.role as string))
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1 cursor-pointer">
          <Avatar className="size-8">
            <AvatarImage
              src={user?.avatar?.imageUrl}
              alt={`${userName}'s avatar`}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {/* <div className="hidden lg:flex flex-col items-start pr-2">
            <span className="text-sm font-medium leading-none">{userName}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {userRole}
            </span>
          </div> */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="p-2">
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
        </div>
        <DropdownMenuSeparator />
        {filteredMenu.map(({ href, name }, i) => {
          return (
            <DropdownMenuItem key={i} asChild className="cursor-pointer">
              <Link href={href}>{name}</Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem
          className="text-destructive"
          disabled={isLoggingOut}
          onClick={signOut}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUser;
