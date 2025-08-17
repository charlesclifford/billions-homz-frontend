"use client";
import { useNotifications } from "@/hooks/useNotifications";
import { INotification } from "@/interfaces/notification.interface";
import { useAppSelector } from "@/store/hooks";
import { Calendar, InboxIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WiSunrise } from "react-icons/wi";
import Notifications from "../shared/Notifications";
import { ThemeToggler } from "../shared/ThemeToggler";
import { SidebarTrigger } from "../ui/sidebar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsRead, markAsRead } from "@/lib/api/notifications";
import { toast } from "sonner";
import { AxiosError } from "axios";

const AdminHeader = () => {
  // const isTablet = useIsTablet();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { notifications, unreadCount } = useNotifications();

  // Update time every minute (instead of every second for better performance)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

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

      return {
        greeting,
        greetingIcon,
        formattedDate,
        formattedTime,
      };
    }, [currentTime]);

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-counts"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-counts"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllMutation.mutate();
    }
  };

  return (
    <header className="sticky top-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ">
      <div className="w-full flex h-16 items-center justify-between px-4 box-border">
        <div className="mr-2">
          <SidebarTrigger className="cursor-pointer" />
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
            <Notifications
              notifications={notifications as INotification[]}
              unreadCount={unreadCount}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={handleNotificationClick}
              emptyState={
                <div className="p-6 py-10 text-center">
                  <InboxIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                  <h4 className="mt-2 text-sm font-medium ">
                    No notifications
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You&apos;re all caught up!
                  </p>
                </div>
              }
            />

            <ThemeToggler />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
