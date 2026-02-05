"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Results Found",
  description = "We couldn’t find any matching properties. Try adjusting your filters.",
  icon = <Building2 className="w-12 h-12 text-muted-foreground" />,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border rounded-2xl bg-muted/20",
        className
      )}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="default"
          className="mt-6 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
