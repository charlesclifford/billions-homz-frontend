"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { BellIcon, Calendar, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WiSunrise } from "react-icons/wi";
import { ThemeToggler } from "../shared/ThemeToggler";
import { Badge } from "../ui/badge";
import { SidebarTrigger } from "../ui/sidebar";

const RealtorHeader = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const unreadCount = 3; // Connect to actual store

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const { greeting, greetingIcon, formattedDate, formattedTime } =
    useMemo(() => {
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

      return {
        greeting,
        greetingIcon,
        formattedDate: currentTime.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        formattedTime: currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    }, [currentTime]);

  // Realtor-specific notifications
  const notifications = [
    {
      id: 1,
      title: "New client inquiry",
      description: "Sarah Johnson is interested in the Ikoyi property",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 2,
      title: "Commission approved",
      description:
        "Your commission for Banana Island sale is ready for payment",
      time: "2 days ago",
      read: false,
    },
    {
      id: 3,
      title: "Viewing scheduled",
      description: "James booked a viewing for tomorrow at 2pm",
      time: "3 days ago",
      read: true,
    },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="mr-2">
          <SidebarTrigger className="cursor-pointer" />
        </div>

        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Date/Time Info */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                {greetingIcon}
                <span>
                  Good {greeting},{" "}
                  <span className="font-medium">{user?.firstName}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span>{formattedDate}</span>
                <span className="mx-1">•</span>
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-accent">
                  <BellIcon size={18} className="text-muted-foreground" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b">
                  <h3 className="font-medium">Realtor Notifications</h3>
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
                      <div className="flex justify-between">
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
                    View all inquiries
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggler />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default RealtorHeader;
