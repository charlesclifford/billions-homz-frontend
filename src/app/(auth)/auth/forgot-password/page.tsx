import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold ">Billions Homz</h2>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold ">
              Reset Your Password
            </h2>
            <p className="text-neutral-500">
              Enter your email to receive a password reset link
            </p>
          </div>
        </div>
        <ForgotPasswordForm />
        <div className="text-center text-sm text-neutral-500 flex items-center justify-center gap-1">
          <ArrowLeft size={16} /> Back to{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
