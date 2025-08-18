import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProperty } from "@/interfaces/property.interface";
import { Bath, BedDouble, Ruler } from "lucide-react";
import PropertyImages from "./PropertyImages";
import PropertyRooms from "./PropertyRooms";

const PropertyDetails = ({ property }: { property: IProperty }) => {
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
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-muted-foreground" />
                <span>{property.bedrooms || 0} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-muted-foreground" />
                <span>{property.bathrooms || 0} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <span>{property.dimensions} sq ft</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p>${property.price?.toLocaleString()}</p>
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
          <p>{property.location?.address}</p>
          <p>
            {property.location?.city}, {property.location?.state}
          </p>
        </CardContent>
      </Card>
      ,{/* Image Gallery Card */}
      <PropertyImages property={property} />
      {/* Rooms Card with Add Dialog */}
      <PropertyRooms property={property} />
    </div>
  );
};

export default PropertyDetails;
