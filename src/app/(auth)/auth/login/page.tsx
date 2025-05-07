import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold ">Billions Homz</h2>
          <p className="text-neutral-500">
            Welcome back! Please sign in to your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
