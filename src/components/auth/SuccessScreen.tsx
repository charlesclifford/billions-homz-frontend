// components/auth/SuccessScreen.tsx
"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button"; // Adjust the import path if necessary

interface SuccessScreenProps {
  email: string;
  onContinue: () => void;
}

/**
 * Renders a success screen after a successful user registration.
 * It instructs the user to check their email for verification and provides a button to continue to the login screen.
 */
const SuccessScreen: React.FC<SuccessScreenProps> = ({ email, onContinue }) => {
  return (
    <div className="w-full max-w-md space-y-8 p-6 md:p-8">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold text-card-foreground">
          Registration Successful!
        </h2>
        <p className="text-muted-foreground text-sm">
          Your account has been successfully created.
        </p>
      </div>

      <div className="space-y-4 text-center">
        <p className="text-base text-card-foreground font-medium">
          A verification link has been sent to:
        </p>
        <p className="text-lg font-semibold text-primary break-words px-4 py-2 bg-secondary rounded-lg">
          {email}
        </p>
        <p className="text-sm text-muted-foreground pt-2">
          Please check your inbox (and spam folder) to verify your email address
          and activate your account.
        </p>
      </div>

      <Button
        onClick={onContinue}
        className="w-full cursor-pointer rounded-[30px] h-[45px]"
      >
        Continue to Login
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        **If you don&apos;t receive the email, please check your spam folder or
        contact support.**
      </p>
    </div>
  );
};

export default SuccessScreen;
