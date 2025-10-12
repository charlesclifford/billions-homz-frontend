import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { LockIcon } from "lucide-react";
import React from "react";

const UpdatePasswordPage = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LockIcon className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold ">Update Your Password</h2>
          {/* <p className="">Update Password</p> */}
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
