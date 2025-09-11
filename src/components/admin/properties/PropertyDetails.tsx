"use client";
import { MapViewer } from "@/components/shared/MapViewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProperty } from "@/interfaces/property.interface";
import { formatCurrency } from "@/utils/helpers";
import {
  Bath,
  BedDouble,
  DollarSign,
  FileText,
  MapPin,
  Ruler,
  Star,
} from "lucide-react";
import PropertyImages from "./PropertyImages";
import PropertyRooms from "./PropertyRooms";

const PropertyDetails = ({ property }: { property: IProperty }) => {
  // Check if we have valid coordinates
  const hasCoordinates =
    property.location?.coordinates?.lat && property.location?.coordinates?.lng;

  const position = hasCoordinates
    ? {
        lat: property.location?.coordinates?.lat,
        lng: property.location?.coordinates?.lng,
      }
    : { lat: 0, lng: 0 };

  const popupContent = `
    <div class="p-3">
      <h3 class="font-semibold">${property.title}</h3>
      <p class="text-sm mt-1">${property.location?.address || ""}</p>
      <p class="text-sm">${property.location?.city || ""}, ${
    property.location?.state || ""
  }</p>
    </div>
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Image Gallery */}
        <PropertyImages property={property} />

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
              {property.description}
            </p>
          </CardContent>
        </Card>

        {/* Features Card */}
        {property.features?.length ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Features & Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 rounded-b-lg overflow-hidden">
              {hasCoordinates ? (
                <MapViewer
                  lat={position.lat}
                  lng={position.lng}
                  height="100%"
                  showMarker={true}
                  showPopup={true}
                  popupContent={popupContent}
                  zoom={14}
                  interactive={true}
                  showControls={true}
                />
              ) : (
                <div className="h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    No location data available
                  </p>
                </div>
              )}
            </div>
            {property.location?.address && (
              <p className="mt-4 px-6 pb-4 text-sm text-muted-foreground">
                Address: {property.location.address}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Rooms Card with Add Dialog */}
        <PropertyRooms property={property} />
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
              <span className="text-muted-foreground">Price</span>
              <span className="text-2xl font-bold">
                {formatCurrency(property.price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Listing Type</span>
              <span className="font-medium capitalize">
                {property.listingType}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Property Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property Type</span>
              <span className="font-medium capitalize">{property.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                Bedrooms
              </span>
              <span className="font-medium">{property.bedrooms || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Bath className="h-4 w-4" />
                Bathrooms
              </span>
              <span className="font-medium">{property.bathrooms || 0}</span>
            </div>
            {property.dimensions && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  Area
                </span>
                <span className="font-medium">{property.dimensions} sq ft</span>
              </div>
            )}
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
            {property.location?.country && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country</span>
                <span className="font-medium">{property.location.country}</span>
              </div>
            )}
            {property.location?.state && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">State</span>
                <span className="font-medium">{property.location.state}</span>
              </div>
            )}
            {property.location?.city && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium">{property.location.city}</span>
              </div>
            )}
            {property.location?.address && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-right max-w-[150px] truncate">
                  {property.location.address}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyDetails;
