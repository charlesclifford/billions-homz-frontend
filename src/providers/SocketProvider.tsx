"use client";

import { TOKEN_NAME } from "@/constants/app.constant";
import { INotification } from "@/interfaces/notification.interface";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAppSelector } from "@/store/hooks";
import { useQueryClient } from "@tanstack/react-query";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const token = cookies.get(TOKEN_NAME);
  const { user } = useAppSelector((state) => state.auth);
  const hasJoinedRoom = useRef(false);
  const currentRoom = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Reset room join status when user changes
  useEffect(() => {
    hasJoinedRoom.current = false;
    currentRoom.current = null;
  }, [user?._id]);

  const handleConnect = useCallback(() => {
    if (!user) return;

    console.log("🔌✅ Socket connected successfully");

    // Join the notification room
    const room = `${user.role}:${user._id}`;

    // Only join if we haven't already or if room changed
    if (!hasJoinedRoom.current || currentRoom.current !== room) {
      // console.log(`📨 Joining notification room: ${room}`);
      const socket = connectSocket(token!);
      socket.emit("join-room", room);
      hasJoinedRoom.current = true;
      currentRoom.current = room;
    }
  }, [user, token]);

  const handleDisconnect = useCallback((reason: string) => {
    console.log("❌ Socket disconnected:", reason);
    hasJoinedRoom.current = false;
    currentRoom.current = null;
  }, []);

  const handleConnectError = useCallback((error: Error) => {
    console.error("🚫 Socket connection failed:", error.message);
    hasJoinedRoom.current = false;

    // Show user-friendly error for auth issues
    if (
      error.message.includes("Authentication") ||
      error.message.includes("Unauthorized")
    ) {
      toast.error("Authentication failed", {
        description: "Please refresh the page and try again",
        duration: 5000,
      });
    }
  }, []);

  const handleNewNotification = useCallback(
    (notification: INotification) => {
      // console.log("🔔 New notification received:", {
      //   id: notification._id,
      //   title: notification.title,
      //   type: notification.type,
      //   recipient: notification.recipient,
      // });

      toast(notification.title, {
        description: notification.message,
        action: notification.link
          ? {
              label: "View",
              onClick: () => {
                // Handle both relative and absolute links
                if (notification.link?.startsWith("http")) {
                  window.open(notification.link, "_blank");
                } else {
                  router.push(notification.link);
                }
              },
            }
          : undefined,
        duration: 6000,
        position: "bottom-right",
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-counts"] });
    },
    [queryClient]
  );

  const handleReconnect = useCallback(() => {
    // console.log("🔄 Socket reconnected, rejoining room...");
    hasJoinedRoom.current = false; // Force rejoin
    handleConnect();
  }, [handleConnect]);

  useEffect(() => {
    // Don't connect if no token or user
    if (!token || !user) {
      console.log("⏳ Waiting for token and user data...");
      return;
    }

    // console.log("🚀 Initializing socket connection for user:", user._id);

    const socket = connectSocket(token);

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect", handleReconnect);
    socket.on("new-notification", handleNewNotification);

    // Handle room join confirmation (if your backend sends this)
    socket.on("join-room", (room: string) => {
      console.log(`✅ Successfully joined room: ${room}`);
    });

    // If already connected, join room immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      // Clean up event listeners
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
      socket.off("new-notification", handleNewNotification);
      socket.off("join-room");

      // Don't disconnect socket here to maintain connection across components
      // Socket will be cleaned up when the app unmounts or token changes
    };
  }, [
    token,
    user,
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleReconnect,
    handleNewNotification,
  ]);

  // Clean up socket when component unmounts or auth changes
  useEffect(() => {
    return () => {
      if (!token || !user) {
        disconnectSocket();
      }
    };
  }, [token, user]);

  return <>{children}</>;
};
