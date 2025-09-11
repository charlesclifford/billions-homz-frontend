import { MapViewer } from "@/components/shared/MapViewer"; // Adjust the import path as needed
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IEstate } from "@/interfaces/estate.interface";
import { getEstateById } from "@/lib/api/properties";
import { formatCurrency } from "@/utils/helpers";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Edit,
  FileText,
  Home,
  MapPin,
  Ruler,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const EstateDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = await getEstateById(id);

  const estate = data as IEstate;

  if (!estate) {
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
              <BreadcrumbLink href="/admin/estates">Estates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize truncate max-w-[200px]">
                {estate.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/estates">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Estates
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/estates/${estate._id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Estate
            </Link>
          </Button>
        </div>
      </div>

      {/* Estate Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {estate.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 capitalize"
          >
            <Home className="h-3 w-3" />
            {estate.estateType}
          </Badge>
          {estate.allowInstallment && (
            <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="h-3 w-3" />
              Installment Available
            </Badge>
          )}
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <MapPin className="h-3 w-3" />
            {estate.location.city}, {estate.location.state}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video relative rounded-t-lg overflow-hidden">
                <Image
                  src={
                    estate.bannerImage?.imageUrl || "/placeholder-estate.jpg"
                  }
                  alt={estate.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {estate.description}
              </p>
            </CardContent>
          </Card>

          {/* Features Card */}
          {estate.features && estate.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Features & Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {estate.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Map */}
          {estate.location.coordinates && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 rounded-b-lg overflow-hidden">
                  <MapViewer
                    lat={estate.location.coordinates.lat}
                    lng={estate.location.coordinates.lng}
                    height="100%"
                    showMarker={true}
                    showPopup={true}
                    popupContent={`
                      <div class="p-1">
                        <h3 class="font-semibold capitalize">${estate.name}</h3>
                        <p class="text-sm mt-1">${
                          estate.location.address || ""
                        }</p>
                        <p class="text-sm capitalize">${
                          estate.location.city
                        }, ${estate.location.state}</p>
                      </div>
                    `}
                    zoom={14}
                    interactive={true}
                    showControls={true}
                  />
                </div>
                {estate.location.address && (
                  <p className="mt-4 px-6 pb-4 text-sm text-muted-foreground">
                    Address: {estate.location.address}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price per unit</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(estate.price || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Units Available</span>
                <span className="font-medium">
                  {(estate.totalUnits || 0) - (estate.soldUnits || 0)} units
                </span>
              </div>
              {estate.plotSize && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    Plot Size
                  </span>
                  <span className="font-medium">{estate.plotSize} sqm</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estate Type</span>
                <span className="font-medium capitalize">
                  {estate.estateType}
                </span>
              </div>
              {estate.plotSize && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    Plot Size
                  </span>
                  <span className="font-medium">{estate.plotSize} sqm</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Units</span>
                <span className="font-medium">{estate.totalUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Installment Plan</span>
                <span className="font-medium">
                  {estate.allowInstallment ? "Available" : "Not Available"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Location Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country</span>
                <span className="font-medium">{estate.location.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">State</span>
                <span className="font-medium">{estate.location.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium">{estate.location.city}</span>
              </div>
              {estate.location.address && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[150px] truncate">
                    {estate.location.address}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Landmarks Card */}
          {estate.location.landmarks &&
            estate.location.landmarks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Landmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {estate.location.landmarks.map((landmark, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        </div>
                        <span className="text-sm">{landmark}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* Documents Card */}
          {estate.documents && estate.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {estate.documents.map((document, index) => (
                    <li key={index} className="flex items-center">
                      <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{document}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Marketing Notes (if available) */}
      {estate.marketingNotes && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Marketing Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {estate.marketingNotes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EstateDetailsPage;
