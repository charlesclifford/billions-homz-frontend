import { FileText } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const RealtorSalesHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="hidden sm:flex mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/realtor/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Sales</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon with better styling */}
          <div className="border border-primary/20 bg-primary/10 p-3 rounded-full">
            <FileText className="w-5 h-5 text-primary" />
          </div>

          {/* Title with responsive sizing */}
          <h1 className="text-primary text-2xl md:text-3xl font-semibold">
            My Sales
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RealtorSalesHeader;
