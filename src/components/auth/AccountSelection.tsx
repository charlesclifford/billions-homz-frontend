"use client";
import { setAccountType } from "@/store/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React from "react";
import RegisterForm from "./RegisterForm";
import { ArrowLeftCircle } from "lucide-react";
import { Button } from "../ui/button";

const AccountSelection = () => {
  const dispatch = useAppDispatch();
  const { accountType } = useAppSelector((state) => state.auth);

  return (
    <div>
      {/* Show role selection if no type is selected */}
      {!accountType ? (
        <div className="space-y-6">
          <h3 className="text-center text-lg font-medium">
            Choose an account type
          </h3>
          <div className="flex flex-col items-center gap-6">
            <Button
              className="w-full rounded-sm cursor-pointer"
              onClick={() => dispatch(setAccountType("user"))}
            >
              I&apos;m a User
            </Button>
            <Button
              className="w-full rounded-sm cursor-pointer"
              onClick={() => dispatch(setAccountType("realtor"))}
            >
              I&apos;m a Realtor
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Back button to change role selection */}
          <Button
            variant={"link"}
            className="mb-8 cursor-pointer px-0"
            onClick={() => dispatch(setAccountType(null))}
          >
            <ArrowLeftCircle />
            Change account type
          </Button>

          {/* Display appropriate form based on selection */}
          {accountType !== null && <RegisterForm />}
        </>
      )}
    </div>
  );
};

export default AccountSelection;
