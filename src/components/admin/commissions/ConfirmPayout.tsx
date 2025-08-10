"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ICommission } from "@/interfaces/commission.interface";
import { processPayout } from "@/lib/api/commissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";
import { formatDate } from "date-fns";

const ConfirmPayout = ({ commission }: { commission: ICommission }) => {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);

  const payoutMutation = useMutation({
    mutationFn: processPayout,
    onSuccess: (data) => {
      toast.success(data?.message || "Payout processed successfully");
      queryClient.invalidateQueries({ queryKey: ["allCommissions"] });
      queryClient.invalidateQueries({ queryKey: ["realtorCommissions"] });
      setShowDialog(false);
    },
    onError: (error: Error) => {
      console.error("Error processing payout:", error);
      toast.error(error.message || "Failed to process payout");
    },
  });

  const handlePayout = () => {
    if (!commission._id) {
      toast.error("Invalid commission ID");
      return;
    }
    payoutMutation.mutate(commission._id);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          disabled={payoutMutation.isPending}
        >
          {payoutMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Payout"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Confirm Payout Processing</DialogTitle>
          <DialogDescription>
            Verify payment details before marking as paid
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Realtor:
            </div>
            <div className="col-span-3 font-medium">
              {commission.realtor?.firstName} {commission.realtor?.lastName}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Amount:
            </div>
            <div className="col-span-3 font-medium text-blue-600">
              {formatCurrency(commission.amount)}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Approved On:
            </div>
            <div className="col-span-3 font-medium">
              {formatDate(commission.updatedAt || new Date(), "PPPp")}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setShowDialog(false)}
            disabled={payoutMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={handlePayout}
            disabled={payoutMutation.isPending}
          >
            {payoutMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payout"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPayout;
