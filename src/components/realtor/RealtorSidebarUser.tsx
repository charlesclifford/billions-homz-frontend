"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";

const RealtorSidebarUser = () => {
  const { isMobile } = useSidebar();
  const { user } = useAppSelector((state) => state.auth);
  const { signOut, isLoggingOut } = useLogout();

  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const userRole = "realtor"; // Fixed role for this component

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={user?.avatar?.imageUrl}
                  alt={`${userName}'s avatar`}
                />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {formatText(userRole)}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatar?.imageUrl}
                    alt={`${userName}'s avatar`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">
                    {formatText(userRole)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <SidebarMenuButton
                className="w-full justify-start text-destructive hover:text-destructive cursor-pointer"
                disabled={isLoggingOut}
                tooltip={"Sign Out"}
                onClick={signOut}
              >
                <LogOutIcon />
                <span className="sidebar-collapsed:hidden">Sign Out</span>
                {isLoggingOut && (
                  <span className="ml-auto">
                    <svg
                      className="animate-spin h-4 w-4 text-destructive"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
              </SidebarMenuButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default RealtorSidebarUser;
