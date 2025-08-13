"use client";
import { InputWithAffix } from "@/components/shared/InputWithAffix";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getSettings, updateSettings } from "@/lib/api/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ICommissionSetting {
  _id: string;
  commissionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z.object({
  commissionPercentage: z
    .number({
      required_error: "Commission percentage is required",
      invalid_type_error: "Commission percentage must be a number",
    })
    .min(0, "Commission must be at least 0%")
    .max(100, "Commission cannot exceed 100%"),
});

export type FormValues = z.infer<typeof formSchema>;

const CommissionSettings = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    select: (res) => res.data as ICommissionSetting,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commissionPercentage: settings?.commissionPercentage || undefined,
    },
  });

  // Update form values when data loads
  useEffect(() => {
    if (settings) {
      form.reset({
        commissionPercentage: settings.commissionPercentage,
      });
    }
  }, [settings, form]);

  // Mutation for updating settings
  const { mutate, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Commission settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setOpenDialog(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
      setOpenDialog(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    setPendingValues(values);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (pendingValues) {
      mutate(pendingValues);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Commission Settings</h3>
        <p className="text-sm text-muted-foreground">
          Set the platform commission percentage
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md"
        >
          <FormField
            control={form.control}
            name="commissionPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Percentage</FormLabel>
                <FormControl>
                  <InputWithAffix
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={Math.round(field.value * 100)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      // Convert percentage back to decimal for storage
                      field.onChange(value / 100);
                    }}
                    suffix="%"
                    className="focus-visible:ring-0 shadow-none rounded-sm"
                  />
                </FormControl>
                <FormDescription>
                  Enter a value between 0 (0%) and 1 (100%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden">
              <DialogHeader>
                <DialogTitle>Confirm Commission Change</DialogTitle>
                <DialogDescription>
                  Are you sure you want to change the commission to{" "}
                  {pendingValues
                    ? Math.round(pendingValues.commissionPercentage * 100)
                    : 0}
                  %?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={handleConfirm}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Confirm Change"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
};

export default CommissionSettings;
