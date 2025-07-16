"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const SessionExpiredDialog = ({
  open,
  onConfirm,
}: {
  open: boolean;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px] [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Session Expired
          </DialogTitle>
          <DialogDescription className="text-center">
            Your session has ended. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button size="lg" className="px-8 cursor-pointer" onClick={onConfirm}>
            Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
