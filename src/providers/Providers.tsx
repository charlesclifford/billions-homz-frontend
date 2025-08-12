import React from "react";
import StoreProvider from "./StoreProvider";
import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import AuthGuard from "@/guards/AuthGuard";
import "react-phone-number-input/style.css";
import { SocketProvider } from "./SocketProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <QueryProvider>
          <AuthGuard>
            <SocketProvider>
              {children}
              </SocketProvider>
          </AuthGuard>
        </QueryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default Providers;
