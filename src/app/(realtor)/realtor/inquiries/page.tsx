import InquiriesTable from "@/components/realtor/inquiries/InquiriesTable";
import React from "react";

const InquiriesPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Client Inquiries</h1>
      <InquiriesTable />
    </div>
  );
};

export default InquiriesPage;
