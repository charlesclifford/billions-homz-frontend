"use client";
import { verifyEmail } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      toast.success("Success", {
        description: data.message,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
      // Redirect to login/dashboard after 3 seconds
      setTimeout(() => router.push("/auth/login"), 3000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error("Verification Failed", {
        description:
          error.response?.data?.message ||
          "Invalid or expired verification link",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  const handleVerifyEmail = (token: string) => {
    verifyMutation.mutate({ token });
  };

  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Missing Verification Token</h1>
        <p className="text-muted-foreground text-center">
          The verification link is invalid. Please check your email for the
          correct link or request a new one.
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="cursor-pointer rounded-sm"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
          {/* <Button
            className="cursor-pointer rounded-sm"
            onClick={() => router.push("/resend-verification")}
          >
            Resend Verification
          </Button> */}
        </div>
      </div>
    );
  }

  if (verifyMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <h1 className="text-2xl font-bold">Verifying Your Email</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your email address...
        </p>
      </div>
    );
  }

  if (verifyMutation.isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Verification Failed</h1>
        <p className="text-muted-foreground text-center">
          {(verifyMutation.error as AxiosError<{ message: string }>).response
            ?.data?.message ||
            "Invalid or expired verification link. Please request a new one."}
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="cursor-pointer rounded-sm"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
          {/* <Button
            className="cursor-pointer rounded-sm"
            onClick={() => router.push("/resend-verification")}
          >
            Resend Verification
          </Button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <CheckCircle2 className="h-12 w-12 text-green-500" />
      <h1 className="text-2xl font-bold">Email Verified Successfully!</h1>
      <p className="text-muted-foreground">
        Your email address has been successfully verified.
      </p>
      <p className="text-sm text-muted-foreground">
        You will be redirected shortly...
      </p>
      <Button
        onClick={() => router.push("/login")}
        className="mt-4 cursor-pointer rounded-sm"
      >
        Go to Login
      </Button>
    </div>
  );
};

export default VerifyEmailContent;
