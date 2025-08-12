// components/SocketProvider.tsx
"use client";

import { TOKEN_NAME } from "@/constants/app.constant";
import { INotification } from "@/interfaces/notification.interface";
import { connectSocket } from "@/lib/socket";
import { useAppSelector } from "@/store/hooks";
import cookies from "js-cookie";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const token = cookies.get(TOKEN_NAME);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) return;

    const socket = connectSocket(token);

    const handleConnect = () => {
      console.log("Socket connected");
      const room = `${user.role}:${user._id}`;
      // console.log(`join to room: ${room}`);
      socket.emit("join-room", room);
    };

    // Handle new notifications
    const handleNewNotification = (notification: INotification) => {
      console.log("New notification received:", notification);
      toast(notification.title, {
        description: notification.message,
        action: {
          label: "View",
          onClick: () => window.open(notification.link, "_blank"),
        },
      });
    };

    socket.on("connect", handleConnect);
    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-notification", handleNewNotification);

      // Don't disconnect here to maintain connection
      // Only clean up listeners
    };
  }, [token, user]);

  return <>{children}</>;
};
