"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "success" | "error";
  title: string;
  description: string;
}

export function StatusDialog({
  open,
  onOpenChange,
  type = "success",
  title,
  description,
}: StatusDialogProps) {
  const isSuccess = type === "success";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[24px] py-10 text-center">
        {isSuccess ? (
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
        ) : (
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        )}

        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-2xl font-bold mb-2 text-center",
              !isSuccess && "text-red-600"
            )}
          >
            {title}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
