"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2Icon, LockIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccess(true);

      // Optional: auto redirect after delay
      setTimeout(() => router.push("/auth/login"), 3000);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const apiMessage =
        error?.details?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Failed to reset password";

      toast.error(apiMessage);
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    mutation.mutate({
      token,
      newPassword: values.password,
    });
  };

  if (success) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md p-6 md:p-8">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Password Reset Successful!</h1>
            <p className="text-muted-foreground text-sm">
              Your password has been successfully reset. You can now log in
              using your new password.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to login...
            </p>
          </div>
          <Button
            onClick={() => router.push("/auth/login")}
            className="mt-4 w-full rounded-[30px] h-[45px]"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 ">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LockIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Reset Your Password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your new password to regain access to your account.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="rounded-[30px] h-[45px] px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="rounded-[30px] h-[45px] px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-[30px] h-[45px]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-primary hover:underline"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
