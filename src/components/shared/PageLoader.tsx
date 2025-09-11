"use client";
import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xs mb-0">
      <Loader2 className="h-10 w-10 animate-spin text-primary " />
    </div>
  );
};
