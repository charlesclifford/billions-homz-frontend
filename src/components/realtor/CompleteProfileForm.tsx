"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateRealtorDetails } from "@/lib/api/realtors";
import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AlertCircle, CheckCircle2, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Form validation schema
const profileFormSchema = z.object({
  bankDetails: z.object({
    bankName: z.string().min(1, "Bank name is required"),
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z
      .string()
      .min(10, "Account number must be at least 10 digits")
      .max(20, "Account number must not exceed 20 digits")
      .regex(/^\d+$/, "Account number must contain only numbers"),
  }),
  uplineDetails: z.object({
    uplineName: z.string().min(1, "Upline name is required"),
    uplinePhone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\d+$/, "Phone number must contain only numbers"),
    bankName: z.string().min(1, "Upline bank name is required"),
    accountName: z.string().min(1, "Upline account name is required"),
    accountNumber: z
      .string()
      .min(10, "Upline account number must be at least 10 digits")
      .max(20, "Upline account number must not exceed 20 digits")
      .regex(/^\d+$/, "Upline account number must contain only numbers"),
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface CompleteProfileFormProps {
  onSuccess?: () => void;
}

export function CompleteProfileForm({ onSuccess }: CompleteProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bankDetails: {
        bankName: "",
        accountName: "",
        accountNumber: "",
      },
      uplineDetails: {
        uplineName: "",
        uplinePhone: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
      },
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfileFormValues }) =>
      updateRealtorDetails(id, data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsSubmitted(true);

      // Invalidate user query to refetch latest data
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
        return;
      }

      // Default behavior - redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/realtor/dashboard");
      }, 2000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Profile update error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?._id) {
      toast.error("User not found. Please try logging in again.");
      return;
    }

    updateProfileMutation.mutate({
      id: user._id,
      data,
    });
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground">
              Profile Completed!
            </h2>
            <p className="text-muted-foreground">
              Your profile has been successfully updated. You will be redirected
              to your dashboard shortly.
            </p>
            <div className="flex justify-center">
              <Loader2Icon className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-neutral-500">
          Please provide your bank details and upline information to get started
        </p>
      </div>

      <div className="space-y-8">
        {/* info */}
        <div className="flex items-start gap-3 p-4 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            You need to complete your profile before accessing the dashboard.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Bank Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Bank Account Details
                </CardTitle>
                <CardDescription>
                  Your personal bank account information for commission payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bankDetails.bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., First Bank, GTBank"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankDetails.accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., John Doe"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankDetails.accountNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 1234567890"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upline Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Upline Information
                </CardTitle>
                <CardDescription>
                  Details of your upline for referral tracking and payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="uplineDetails.uplineName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upline Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full name of your upline"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uplineDetails.uplinePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upline Phone *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 08012345678"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uplineDetails.bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upline Bank Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., First Bank, GTBank"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uplineDetails.accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upline Account Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Jane Smith"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uplineDetails.accountNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Upline Account Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 1234567890"
                            className="focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="cursor-pointer"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
