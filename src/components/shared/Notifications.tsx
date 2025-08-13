"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INotification } from "@/interfaces/notification.interface";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { BellIcon, Circle, Loader2 } from "lucide-react";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

type NotificationsProps = {
  notifications: INotification[];
  unreadCount?: number;
  onMarkAllAsRead?: () => Promise<void> | void;
  onNotificationClick?: (notification: INotification) => void;
  emptyState?: React.ReactNode;
  className?: string;
  popoverAlign?: "start" | "center" | "end";
  popoverWidth?: string;
  height?: string;
  triggerClassName?: string;
  badgeClassName?: string;
  isLoading?: boolean;
  loadingState?: React.ReactNode;
};

const Notifications = ({
  notifications = [],
  unreadCount = 0,
  onMarkAllAsRead,
  onNotificationClick,
  emptyState = (
    <div className="p-4 text-center text-muted-foreground">
      No new notifications
    </div>
  ),
  className = "",
  popoverAlign = "end",
  popoverWidth = "w-80",
  height = "h-[400px]",
  triggerClassName = "",
  badgeClassName = "",
  isLoading = false,
  loadingState = (
    <div className="flex justify-center p-4">
      <Loader2 className="animate-spin text-primary" />
    </div>
  ),
}: NotificationsProps) => {
  const hasUnread = unreadCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-full hover:bg-accent cursor-pointer",
            triggerClassName
          )}
          aria-label="Notifications"
        >
          <BellIcon size={18} className="text-muted-foreground" />
          {hasUnread && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center",
                badgeClassName
              )}
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", popoverWidth, className)}
        align={popoverAlign}
      >
        <div className="p-2 border-b">
          <div className="flex justify-between items-center px-2 py-1">
            <h3 className="font-medium">Notifications</h3>
            {onMarkAllAsRead && hasUnread && (
              <Button
                variant="link"
                size="sm"
                className="h-8 text-xs text-primary cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllAsRead();
                }}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className={height}>
          {isLoading
            ? loadingState
            : notifications.length === 0
            ? emptyState
            : notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="py-2 px-3 border-b hover:bg-accent cursor-pointer"
                  onClick={() => onNotificationClick?.(notification)}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="pt-0.5">
                          {!notification.isRead ? (
                            <Circle className="h-2 w-2 fill-primary text-primary" />
                          ) : (
                            <Circle className="h-2 w-2 text-transparent" />
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
