"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Users2Icon } from "lucide-react";
import InviteAdmin from "./InviteAdmin";

const MembersHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="hidden sm:flex mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin Members</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon with better styling */}
          <div className="border border-primary/20 bg-primary/10 p-3 rounded-full">
            <Users2Icon className="w-5 h-5 text-primary" />
          </div>

          {/* Title with responsive sizing */}
          <h1 className="text-primary text-2xl md:text-3xl font-semibold">
            Admins
          </h1>
        </div>

        {/* Invite admins */}
        <InviteAdmin />
      </div>
    </div>
  );
};

export default MembersHeader;
