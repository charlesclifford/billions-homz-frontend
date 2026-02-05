"use client";
import React from "react";
import { Button } from "../ui/button";

interface BlockedUserDialogProps {
  open: boolean;
  onConfirm: () => void;
}

const BlockedUserDialog: React.FC<BlockedUserDialogProps> = ({
  open,
  onConfirm,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-400/30 rounded-full">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-neutral-900 dark:text-neutral-200 text-center">
            Account Blocked
          </h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 text-center">
            Your account has been temporarily suspended. Please contact support
            for more information.
          </p>
          <div className="mt-6">
            <Button
              variant={"destructive"}
              onClick={onConfirm}
              className="w-full px-4 py-2 font-medium cursor-pointer"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserDialog;
