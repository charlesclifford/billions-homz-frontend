import PropertyForm from "@/components/admin/properties/PropertyForm";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { IProperty } from "@/interfaces/property.interface";
import { getPropertyById } from "@/lib/api/properties";
import { notFound } from "next/navigation";
import React from "react";

const PropertyEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = await getPropertyById(id);

  const property = data as IProperty;

  if (!property) {
    return notFound();
  }

  return (
    <div className="">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="hidden sm:flex mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/properties">Properties</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {property.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6 capitalize">{property.title}</h1>
      <PropertyForm initialValues={property} />
    </div>
  );
};

export default PropertyEditPage;
