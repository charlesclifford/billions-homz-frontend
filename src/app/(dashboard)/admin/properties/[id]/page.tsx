import PropertyDetails from "@/components/admin/properties/PropertyDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { IProperty } from "@/interfaces/property.interface";
import { getPropertyById } from "@/lib/api/properties";
import { notFound } from "next/navigation";

const PropertyDetailsPage = async ({
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

      {/* Header with edit button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold capitalize">{property.title}</h1>
        <Button asChild>
          <a href={`/admin/properties/${property._id}/edit`}>Edit Property</a>
        </Button>
      </div>

      {/* Property Details */}
      <PropertyDetails property={property} />
    </div>
  );
};

export default PropertyDetailsPage;
