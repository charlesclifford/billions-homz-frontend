import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { HomeIcon, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const PropertyHeader = () => {
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
            <BreadcrumbPage>Properties</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon with better styling */}
          <div className="border border-primary/20 bg-primary/10 p-3 rounded-full">
            <HomeIcon className="w-5 h-5 text-primary" />
          </div>

          {/* Title with responsive sizing */}
          <h1 className="text-primary text-2xl md:text-3xl font-semibold">
            Properties
          </h1>
        </div>

        {/* Action button */}
        <Button asChild>
          <Link href="/admin/properties/new" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>New Property</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PropertyHeader;
