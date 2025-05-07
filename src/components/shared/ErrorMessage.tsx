import { AlertTriangle } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-6 rounded-xl text-center animate-fade-in">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />

        <p className="text-lg font-semibold text-gray-800 ">{message}</p>

        {onRetry && (
          <Button onClick={onRetry} className="mt-4 rounded-sm cursor-pointer">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
