"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { ApiError } from "@/guards/AuthGuard";
import { logoutUser } from "@/lib/api/auth";
import { logout } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast.success(data.message);
      cookies.remove(TOKEN_NAME);
      cookies.remove(USER_DETAILS);
      dispatch(logout());
      router.push("/auth/login");
    },
    onError: (error: ApiError) => {
      if (error.status === 401) {
        // Token expired or invalid → do a clean logout
        cookies.remove(TOKEN_NAME);
        cookies.remove(USER_DETAILS);
        dispatch(logout());
        router.push("/auth/login");
      } else {
        console.error("Logout error:", error);
        toast.error(error.message || "Failed to logout");
      }
    },
  });

  const signOut = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return { signOut, isLoggingOut: logoutMutation.isPending };
};

export default useLogout;
