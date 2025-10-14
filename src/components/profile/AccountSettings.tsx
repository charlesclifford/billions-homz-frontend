"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { changePasswordInput } from "@/interfaces/auth.interface";
import { changePassword } from "@/lib/api/auth"; // adjust import
import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FeedbackDialog } from "../shared/FeedbackDialog";
const passwordSchema = z
  .object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;

const AccountSettings = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      // toast.success(data?.message || "Password updated successfully");
      form.reset();
      setShowChangeDialog(false);
      setShowSuccessDialog(true);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.details?.message ||
          error?.response?.data?.message ||
          "Failed to update password"
      );
    },
  });

  const onSubmit = (values: changePasswordInput) => {
    changePasswordMutation.mutate(values);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    setShowChangeDialog(isOpen);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Account Security</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Password */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Password</p>
          </div>

          <Dialog open={showChangeDialog} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  id="password-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showOldPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="focus-visible:ring-2 pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="focus-visible:ring-2 pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="focus-visible:ring-2 pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <DialogFooter>
                <Button
                  type="submit"
                  form="password-form"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Update Password"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ✅ Success Dialog */}
          <FeedbackDialog
            open={showSuccessDialog}
            type="success"
            title="Password Changed Successfully"
            message="Your password has been updated. Use your new password next time
                you log in."
            onClose={() => setShowSuccessDialog(false)}
            actionLabel="Okay"
            onAction={() => setShowSuccessDialog(false)}
          />
        </div>

        <Separator />

        {/* Email Verification */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Email Verification</p>
            <p className="text-sm text-muted-foreground">
              {user?.isVerified
                ? "Your email is verified"
                : "Email not verified"}
            </p>
          </div>
          {user?.isVerified ? (
            <Badge
              variant="secondary"
              className="bg-green-500/10 text-green-600"
            >
              Verified
            </Badge>
          ) : (
            <Button variant="outline" size="sm">
              Verify
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
