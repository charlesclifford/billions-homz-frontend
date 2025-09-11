import PropertyDetails from "@/components/admin/properties/PropertyDetails";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowLeft,
  Edit,
  Home,
  MapPin
} from "lucide-react";
import Link from "next/link";
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
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/properties">
                Properties
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize truncate max-w-[200px]">
                {property.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/properties">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/properties/${property._id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 capitalize"
          >
            <Home className="h-3 w-3" />
            {property.type}
          </Badge>
          <Badge
            variant={property.listingType === "rent" ? "default" : "outline"}
            className="flex items-center gap-1 capitalize"
          >
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <MapPin className="h-3 w-3" />
            {property.location?.city}, {property.location?.state}
          </Badge>
        </div>
      </div>

      {/* Property Details Component */}
      <PropertyDetails property={property} />
    </div>
  );
};

export default PropertyDetailsPage;
