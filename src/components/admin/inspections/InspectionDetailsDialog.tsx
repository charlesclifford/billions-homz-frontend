"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelInspection, confirmInspection } from "@/lib/api/inspections";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { IInspection } from "@/interfaces/inspection.interface";
import {
  Briefcase,
  CalendarDays,
  Clock,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { AxiosError } from "axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: IInspection | null;
}

const InspectionDetailsDialog = ({ open, onOpenChange, inspection }: Props) => {
  const queryClient = useQueryClient();
  const [confirmedDate, setConfirmedDate] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [showConfirmField, setShowConfirmField] = useState(false);
  const [showCancelField, setShowCancelField] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Confirmed":
        return "default";
      case "Cancelled":
        return "destructive";
      case "Completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const confirmMutation = useMutation({
    mutationFn: () =>
      confirmInspection(inspection?._id as string, { confirmedDate }),
    onSuccess: () => {
      setShowConfirmField(false);
      setConfirmedDate("");
      setDialog({
        open: true,
        type: "success",
        title: "Inspection Confirmed",
        message: "This inspection has been successfully confirmed.",
      });
      onOpenChange(false);
    },
    onError: (err: AxiosError<{ message: string }>) =>
      setDialog({
        open: true,
        type: "error",
        title: "Failed to Confirm",
        message: err.message || "Something went wrong while confirming.",
      }),
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      cancelInspection(inspection?._id as string, { cancellationReason }),
    onSuccess: () => {
      setShowCancelField(false);
      setCancellationReason("");
      setDialog({
        open: true,
        type: "success",
        title: "Inspection Cancelled",
        message: "This inspection has been successfully cancelled.",
      });
      onOpenChange(false);
    },
    onError: (err: AxiosError<{ message: string }>) =>
      setDialog({
        open: true,
        type: "error",
        title: "Failed to Cancel",
        message: err.message || "Something went wrong while cancelling.",
      }),
  });

  if (!inspection) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
          if (!isOpen) {
            // Reset all fields when dialog closes
            setShowConfirmField(false);
            setShowCancelField(false);
            setConfirmedDate("");
            setCancellationReason("");
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl">
          {/* Header */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {inspection.firstName} {inspection.lastName}
            </DialogTitle>
            <DialogDescription>
              Scheduled for{" "}
              <span className="font-medium">{inspection.day}</span>
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          {/* Details Section */}
          <div className="space-y-4 text-sm">
            {/* Estate & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Estate</p>
                  <p className="font-medium capitalize">{inspection.estate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant={getStatusVariant(inspection.status)}>
                    {inspection.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{inspection.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium break-all">
                    {inspection.email || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Realtor & Source */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Realtor</p>
                  <p className="font-medium">{inspection.realtor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Source</p>
                  <p className="font-medium">{inspection.source}</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            {inspection.confirmedDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">
                    Confirmed Date
                  </p>
                  <p className="font-medium">
                    {format(
                      new Date(inspection.confirmedDate),
                      "MMM dd, yyyy hh:mm a"
                    )}
                  </p>
                </div>
              </div>
            )}

            {inspection.cancellationReason && (
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-destructive mt-1" />
                <div>
                  <p className="text-muted-foreground text-xs">
                    Cancellation Reason
                  </p>
                  <p className="font-medium text-destructive">
                    {inspection.cancellationReason}
                  </p>
                </div>
              </div>
            )}

            <Separator className="my-3" />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Created:
              </span>
              <span>
                {format(new Date(inspection.createdAt), "MMM dd, yyyy hh:mm a")}
              </span>
            </div>
          </div>

          {/* Confirm or Cancel Actions */}
          {showConfirmField && (
            <div className="mt-6 space-y-4 p-5 rounded-xl border bg-muted/40">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Select Confirmation Date & Time
                </Label>
                <Input
                  type="datetime-local"
                  value={confirmedDate}
                  onChange={(e) => setConfirmedDate(e.target.value)}
                  className="border-muted-foreground/20 focus-visible:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmField(false);
                    setConfirmedDate("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => confirmMutation.mutate()}
                  disabled={!confirmedDate || confirmMutation.isPending}
                >
                  {confirmMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          )}

          {showCancelField && (
            <div className="mt-6 space-y-4 p-5 rounded-xl border border-destructive/30 bg-red-50">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-destructive">
                  Reason for Cancellation
                </Label>
                <Input
                  placeholder="Enter reason..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="border-destructive/30 focus-visible:ring-destructive/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelField(false);
                    setCancellationReason("");
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => cancelMutation.mutate()}
                  disabled={!cancellationReason || cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex justify-between gap-2">
            {inspection.status === "Pending" &&
              !showConfirmField &&
              !showCancelField && (
                <>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setShowConfirmField(true);
                      setShowCancelField(false);
                    }}
                  >
                    Confirm Inspection
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      setShowCancelField(true);
                      setShowConfirmField(false);
                    }}
                  >
                    Cancel Inspection
                  </Button>
                </>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        onAction={() => {
          setDialog((prev) => ({ ...prev, open: false }));
          queryClient.invalidateQueries({ queryKey: ["inspections"] });
        }}
        hideCloseButton
        allowOutsideInteraction={false}
      />
    </>
  );
};

export default InspectionDetailsDialog;
