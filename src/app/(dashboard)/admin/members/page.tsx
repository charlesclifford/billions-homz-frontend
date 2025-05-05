import MembersFilter from "@/components/admin/members/MembersFilter";
import MembersHeader from "@/components/admin/members/MembersHeader";
import MembersTable from "@/components/admin/members/MembersTable";
import React from "react";

const AdminMembersPage = () => {
  return (
    <div className="w-full">
      <MembersHeader />

      <div className="space-y-8">
        <MembersFilter />

        <div className="w-full">
          <MembersTable />
        </div>
      </div>
    </div>
  );
};

export default AdminMembersPage;
