import AccountSettings from "@/components/profile/AccountSettings";
import React from "react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings </h1>
          <p className="text-muted-foreground mt-1"></p>
        </div>
      </div>
      <AccountSettings />
    </div>
  );
};

export default Settings;
