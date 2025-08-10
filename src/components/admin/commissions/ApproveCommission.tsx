import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ICommission } from "@/interfaces/commission.interface";
import { approvePayout } from "@/lib/api/commissions";
import { formatCurrency, formatRate } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ApproveCommission = ({ commission }: { commission: ICommission }) => {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);

  const approveMutation = useMutation({
    mutationFn: approvePayout,
    onSuccess: (data) => {
      toast.success(data?.message || "Commission approved successfully");
      queryClient.invalidateQueries({ queryKey: ["allCommissions"] });
      queryClient.invalidateQueries({ queryKey: ["realtorCommissions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setShowDialog(false);
    },
    onError: (error: Error) => {
      console.error("Error approving commission:", error);
      toast.error(error.message || "Failed to approve commission");
    },
  });

  const handleApproval = () => {
    if (!commission._id) {
      toast.error("Invalid commission ID");
      return;
    }
    approveMutation.mutate(commission._id);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="cursor-pointer"
          disabled={approveMutation.isPending}
        >
          {approveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Approve"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Approve Commission Payment</DialogTitle>
          <DialogDescription>
            Review commission details before approval
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Realtor:
            </div>
            <div className="col-span-3 font-medium capitalize">
              {commission.realtor?.firstName} {commission.realtor?.lastName}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Estate:
            </div>
            <div className="col-span-3 font-medium capitalize">
              {commission.sale?.estate?.name || "Unknown Property"}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Sale Amount:
            </div>
            <div className="col-span-3 font-medium">
              {formatCurrency(commission.sale?.amountPaid)}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Commission Rate:
            </div>
            <div className="col-span-3 font-medium">
              {formatRate(commission.rate, {
                decimalPlaces: 0,
              })}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Commission Amount:
            </div>
            <div className="col-span-3 font-medium text-green-600">
              {formatCurrency(commission.amount)}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Sale Date:
            </div>
            <div className="col-span-3 font-medium">
              {formatDate(commission.sale?.dateSold || new Date(), "PPP")}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Requested On:
            </div>
            <div className="col-span-3 font-medium">
              {formatDate(
                commission.paymentRequest.requestedAt || new Date(),
                "PPPp"
              )}
            </div>
          </div>

          {commission.paymentRequest?.requestNote && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                Notes:
              </div>
              <div className="col-span-3 p-3 bg-muted/50 rounded-md">
                {commission.paymentRequest.requestNote}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setShowDialog(false)}
            disabled={approveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={handleApproval}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Confirm Approval"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveCommission;
