"use client";
import { useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import { BellIcon, Calendar, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WiSunrise } from "react-icons/wi";
import { ThemeToggler } from "../shared/ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const AdminHeader = () => {
  // const isTablet = useIsTablet();
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const unreadCount = 3; // Mock unread notifications count

  // Update time every minute (instead of every second for better performance)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const {
    greeting,
    greetingIcon,
    formattedDate,
    formattedTime,
    userName,
    userRole,
  } = useMemo(() => {
    const currentHour = currentTime.getHours();
    let greeting: string;
    let greetingIcon: React.ReactNode;

    if (currentHour < 12) {
      greeting = "morning";
      greetingIcon = <WiSunrise size={20} className="text-amber-500" />;
    } else if (currentHour < 17) {
      greeting = "afternoon";
      greetingIcon = <SunIcon size={18} className="text-amber-400" />;
    } else {
      greeting = "evening";
      greetingIcon = <MoonIcon size={18} className="text-indigo-400" />;
    }

    const formattedDate = currentTime.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const formattedTime = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
    const userRole = user?.role
      ? formatText(user.role).toLowerCase()
      : "unknown role";

    return {
      greeting,
      greetingIcon,
      formattedDate,
      formattedTime,
      userName,
      userRole,
    };
  }, [currentTime, user]);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New booking request",
      description: "You have a new booking request from John Doe",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment received",
      description: "Payment for booking #1234 has been received",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "System update",
      description: "New system update available",
      time: "3 days ago",
      read: false,
    },
  ];

  return (
    <header className="sticky w-full top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b box-border">
      <div className="w-full container flex h-16 items-center justify-between px-4">
        <div className="mr-2">
          <SidebarTrigger />
        </div>

        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Date/Time Info - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                {greetingIcon}
                <span>
                  Good {greeting},{" "}
                  <span className="font-medium">{user?.firstName}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} className="text-muted-foreground" />
                <span>{formattedDate}</span>
                <span className="mx-1">•</span>
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Notifications Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-accent">
                  <BellIcon size={18} className="text-muted-foreground" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-2 border-b">
                  <h3 className="font-medium px-2 py-1">Notifications</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 border-b hover:bg-accent cursor-pointer",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t text-center">
                  <button className="text-sm text-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggler />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user?.avatar}
                      alt={`${userName}'s avatar`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start pr-2">
                    <span className="text-sm font-medium leading-none">
                      {userName}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {userRole}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-2">
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole}
                  </p>
                </div>
                <Separator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
