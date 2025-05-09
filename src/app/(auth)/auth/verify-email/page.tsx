import VerifyEmailContent from "@/components/auth/VerifyEmailContent";
import React from "react";

const VerifyEmailPage = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold ">Billions Homz</h2>
        </div>

        <VerifyEmailContent />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
