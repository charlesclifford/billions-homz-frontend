"use client";
import { SessionExpiredDialog } from "@/components/auth/SessionExpiredDialog";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { useUser } from "@/hooks/use-user";
import {
  loginSuccess,
  logout,
  setLoading,
} from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import cookies from "js-cookie";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface ApiError {
  message: string;
  details?: {
    status: boolean;
    message: string;
  };
  status: number;
}

const PROTECTED_ROUTES = [
  /^\/admin(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/realtor(\/.*)?$/,
];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data, isPending, error } = useUser();
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [shouldShowChildren, setShouldShowChildren] = useState(true);

  const isProtectedRoute = PROTECTED_ROUTES.some((pattern) =>
    pattern.test(pathname || "")
  );

  useEffect(() => {
    // Handle loading state
    dispatch(setLoading(isPending));
  }, [isPending, dispatch]);

  useEffect(() => {
    // Always update user state when data is available
    if (data) {
      cookies.set(USER_DETAILS, JSON.stringify(data.data));
      dispatch(loginSuccess({ user: data.data }));
      setShowExpiredDialog(false);
      setShouldShowChildren(true);
    }
  }, [data, dispatch]);

  useEffect(() => {
    // Handle authentication errors
    if (error) {
      const apiError = error as unknown as ApiError;

      const message =
        apiError?.details?.message || apiError?.message || "Unauthorized";

      const shouldLogout =
        apiError.status === 400 ||
        apiError.status === 401 ||
        /unauthorized|token|authentication/i.test(message);

      if (shouldLogout) {
        // Clear invalid session
        cookies.remove(TOKEN_NAME);
        cookies.remove(USER_DETAILS);
        dispatch(logout());

        // Only show dialog on protected routes
        if (isProtectedRoute) {
          setShowExpiredDialog(true);
          setShouldShowChildren(false); // Hide children when session expires
        }
      }
    }
  }, [error, isProtectedRoute, dispatch]);

  const handleLogoutRedirect = () => {
    const returnUrl = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.href = `/auth/login?redirect=${returnUrl}`;
  };

  return (
    <>
      {shouldShowChildren && children}

      {/* Session dialog only for protected routes */}
      {isProtectedRoute && (
        <SessionExpiredDialog
          open={showExpiredDialog}
          onConfirm={handleLogoutRedirect}
        />
      )}
    </>
  );
};

export default AuthGuard;
