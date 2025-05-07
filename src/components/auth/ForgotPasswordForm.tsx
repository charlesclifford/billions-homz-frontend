"use client";
import React from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2Icon, MailCheckIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/lib/api/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const [emailSent, setEmailSent] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: async (data) => {
      toast.success(data.message, {
        description: "Check your inbox for the password reset link",
        icon: <MailCheckIcon className="h-5 w-5 text-green-500" />,
      });
      setEmailSent(true);
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      toast.error("Failed to send reset email", {
        description: errorMessage,
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    submitMutation.mutate(values.email);
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <MailCheckIcon className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => setEmailSent(false)}
        >
          Resend email
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="focus-visible:ring-0 shadow-none rounded-sm"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full rounded-sm cursor-pointer"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;