"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProperty } from "@/interfaces/property.interface";
import { formatCurrency } from "@/utils/helpers";
import PropertyImages from "./PropertyImages";
import PropertyRooms from "./PropertyRooms";
import { MapViewer } from "@/components/shared/MapViewer";

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
    <div>
      <p class="font-semibold">${
        property.location?.address || "Property Location"
      }</p>
      <p>${property.location?.city || ""}, ${property.location?.state || ""}</p>
    </div>
  `;

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{property.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="capitalize">{property.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listing Type</p>
                <p className="capitalize">{property.listingType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p>{property.bedrooms || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <span>{property.bathrooms || 0}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <span>{property.dimensions} sq ft</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p>{formatCurrency(property.price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Features Card */}
      {property.features?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
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
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{property.location?.address}</p>
              <p className="text-muted-foreground">
                {property.location?.city}, {property.location?.state}
                {hasCoordinates && (
                  <span className="ml-2 text-xs">
                    ({property.location?.coordinates?.lat.toFixed(4)},{" "}
                    {property.location?.coordinates?.lng.toFixed(4)})
                  </span>
                )}
              </p>
            </div>

            {/* Map showing coordinates */}
            {hasCoordinates ? (
              <MapViewer
                lat={position.lat}
                lng={position.lng}
                height={300}
                showMarker={true}
                showPopup={true}
                popupContent={popupContent}
                interactive={true}
                showControls={true}
                className="rounded-md border"
              />
            ) : (
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No location data available
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Image Gallery Card */}
      <PropertyImages property={property} />
      {/* Rooms Card with Add Dialog */}
      <PropertyRooms property={property} />
    </div>
  );
};

export default PropertyDetails;
