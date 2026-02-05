"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyTableState({
  title = "No data available",
  description = "There’s nothing to display yet.",
  actionLabel,
  onAction,
  icon = <FileSearch className="w-10 h-10 text-muted-foreground" />,
}: EmptyStateProps) {
  return (
    <div className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="mt-4 cursor-pointer"
            variant="outline"
            size="sm"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </div>
  );
}
