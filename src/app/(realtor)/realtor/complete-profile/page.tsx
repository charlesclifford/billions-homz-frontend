import { CompleteProfileForm } from "@/components/realtor/CompleteProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile - Realtor",
  description: "Complete your profile to start using the realtor dashboard",
};

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <CompleteProfileForm />
      </div>
    </div>
  );
}
