"use client";

import {
  INotification,
  INotificationCount,
} from "@/interfaces/notification.interface";
import {
  getNotifications,
  getUnreadNotificationCounts,
} from "@/lib/api/notifications";
import { getSocket } from "@/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useNotifications() {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isPending: notificationLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select: (data) => data.data as INotification[],
  });

  const { data: count, isPending: countLoading } = useQuery({
    queryKey: ["notifications-counts"],
    queryFn: getUnreadNotificationCounts,
    select: (data) => data.data as INotificationCount,
  });

  // Real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notification: INotification) => {
      // Update notifications list
      queryClient.setQueryData<INotification[]>(
        ["notifications"],
        (old = []) => [notification, ...old]
      );

      // console.log(
      //   "Updated notifications:",
      //   queryClient.getQueryData(["notifications"])
      // );

      // Update unread count
      queryClient.setQueryData<INotificationCount>(
        ["notifications-counts"],
        (old = { unread: 0 }) => ({
          unread: old.unread + 1,
        })
      );

      // Show toast notification
      toast(notification.title, {
        description: notification.message,
        action: notification.link
          ? {
              label: "View",
              onClick: () => window.open(notification.link, "_blank"),
            }
          : undefined,
      });
    };

    socket.on("new-notification", handleNewNotification);
    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [queryClient]);

  return {
    notifications,
    unreadCount: count?.unread || 0,
    isLoading: notificationLoading || countLoading,
  };
}
