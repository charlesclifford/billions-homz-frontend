"use client";

import {
  INotification,
  INotificationCount,
} from "@/interfaces/notification.interface";
import {
  getNotifications,
  getUnreadNotificationCounts,
} from "@/lib/api/notifications";
import { useQuery } from "@tanstack/react-query";

export function useNotifications() {
  // Fetch notifications
  const {
    data: notifications,
    isPending: notificationLoading,
    error: notificationError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select: (data) => data.data as INotification[],
    retry: 3,
    staleTime: 30 * 1000, // 30 seconds
  });

  const {
    data: count,
    isPending: countLoading,
    error: countError,
  } = useQuery({
    queryKey: ["notifications-counts"],
    queryFn: getUnreadNotificationCounts,
    select: (data) => data.data as INotificationCount,
    retry: 3,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    notifications: notifications || [],
    unreadCount: count?.unread || 0,
    isLoading: notificationLoading || countLoading,
    error: notificationError || countError,
  };
}
