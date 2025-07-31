"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SignUpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => setIsOpen(true)}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Sign up
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[30px] p-8 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center">Create an account</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Button asChild variant="outline" className="h-14 rounded-[30px]">
              <Link href="/auth/register/user">
                <div className="text-center w-full">
                  <p className="font-semibold">I&apos;m a User</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 rounded-[30px]">
              <Link href="/auth/register/realtor">
                <div className="text-center w-full">
                  <p className="font-semibold">I&apos;m a Realtor</p>
                </div>
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignUpModal;
