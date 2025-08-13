"use client";
import { useNotifications } from "@/hooks/useNotifications";
import { INotification } from "@/interfaces/notification.interface";
import { markAllAsRead, markAsRead } from "@/lib/api/notifications";
import { useAppSelector } from "@/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Calendar, InboxIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WiSunrise } from "react-icons/wi";
import { toast } from "sonner";
import Notifications from "../shared/Notifications";
import { ThemeToggler } from "../shared/ThemeToggler";
import { SidebarTrigger } from "../ui/sidebar";

const RealtorHeader = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { notifications, unreadCount } = useNotifications();

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
            <Notifications
              notifications={notifications as INotification[]}
              unreadCount={unreadCount}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={handleNotificationClick}
              emptyState={
                <div className="p-6 text-center">
                  <InboxIcon className="mx-auto h-8 w-8 text-muted-foreground" />
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

export default RealtorHeader;
