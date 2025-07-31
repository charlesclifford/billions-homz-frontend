import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import React from "react";

const UpdatePasswordPage = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="lg:text-center space-y-2">
          <h2 className="text-3xl font-bold ">Update Your Password</h2>
          {/* <p className="">Update Password</p> */}
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
