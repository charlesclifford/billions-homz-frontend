"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { requestPayout } from "@/lib/api/commissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RequestPayoutButton({
  commissionId,
  disabled,
}: {
  commissionId?: string;
  disabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);

  const requestMutation = useMutation({
    mutationFn: requestPayout,
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["realtorCommissions"] });
      setShowDialog(false);
    },
    onError: (error: Error) => {
      console.error("Error ", error);
      toast.error(error.message);
    },
  });

  const handleRequest = async () => {
    if (!commissionId) return;
    requestMutation.mutate(commissionId);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          disabled={disabled || requestMutation.isPending}
        >
          {commissionId ? "Request Payout" : "Request New Payout"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Commission Payout</DialogTitle>
          <DialogDescription>
            Are you sure you want to request payout for this commission? The
            admin will review your request.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDialog(false)}
            disabled={requestMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleRequest}
            disabled={requestMutation.isPending}
          >
            {requestMutation.isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
