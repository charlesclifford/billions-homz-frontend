"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { useCallback } from "react";

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  cancelLabel?: string; // ✅ optional cancel label
  onCancel?: () => void; // ✅ optional cancel action
  allowOutsideInteraction?: boolean;
  hideCloseButton?: boolean;
}

const MotionDialogContent = motion(DialogContent);

export const FeedbackDialog = ({
  open,
  onClose,
  type,
  title,
  message,
  actionLabel = "Got it",
  onAction,
  cancelLabel,
  onCancel,
  allowOutsideInteraction = false,
  hideCloseButton = false,
}: FeedbackDialogProps) => {
  const isSuccess = type === "success";
  const controls = useAnimation();

  const handleInteractOutside = useCallback(
    (e: Event) => {
      if (!allowOutsideInteraction) {
        e.preventDefault();
        controls.start({
          y: [0, -8, 8, -3, 0],
          transition: { duration: 0.3, ease: "easeInOut" },
        });
      }
    },
    [allowOutsideInteraction, controls]
  );

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.15, duration: 0.4 },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <MotionDialogContent
        onInteractOutside={handleInteractOutside}
        className={cn(
          "max-w-md w-full rounded-2xl shadow-2xl",
          hideCloseButton && "[&>button]:hidden",
          isSuccess ? "border-t-4 border-primary/20" : "border-t-4 border-red-500"
        )}
        animate={controls}
      >
        <div className="px-8 py-10 flex flex-col items-center text-center">
          {/* Animated Icon */}
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            className={cn(
              "flex items-center justify-center p-2 rounded-full mb-6 relative",
              // isSuccess
              //   ? "bg-gradient-to-br from-emerald-100 to-teal-100"
              //   : "bg-gradient-to-br from-rose-100 to-red-100"
            )}
          >
            {/* Ripple Effect */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full opacity-0",
                isSuccess ? "bg-emerald-200" : "bg-rose-200"
              )}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: 1, duration: 0.6, ease: "easeOut" }}
            />
            {isSuccess ? (
              <CheckCircle className="text-primary" size={64} />
            ) : (
              <X className="text-rose-600" size={64} />
            )}
          </motion.div>

          {/* Title & Message */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className="space-y-3 mb-2"
          >
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{message}</p>
          </motion.div>

          {/* Primary Action */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className={cn("mt-8 w-3/6", cancelLabel ? "space-y-3" : "")}
          >
            <Button
              onClick={() => {
                onAction?.();
                onClose();
              }}
              variant={isSuccess ? "default" : "destructive"}
              className="cursor-pointer w-full"
              size={'lg'}
            >
              {actionLabel}
            </Button>

            {/* Optional Cancel */}
            {cancelLabel && (
              <Button
                onClick={() => {
                  onCancel?.();
                  onClose();
                }}
                variant="outline"
                className="w-full font-medium text-sm py-2.5 rounded-lg"
              >
                {cancelLabel}
              </Button>
            )}
          </motion.div>
        </div>
      </MotionDialogContent>
    </Dialog>
  );
};
