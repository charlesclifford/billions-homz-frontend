import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IProperty } from "@/interfaces/property.interface";
import {
  Bath,
  BedDouble,
  ImagePlus,
  Pencil,
  Plus,
  Ruler,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { AddRoomForm } from "./AddRoomForm";

const PropertyDetails = ({ property }: { property: IProperty }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Image Gallery Card */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {property.images?.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border"
              >
                <Image
                  src={image.imageUrl}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{property.description}</p>
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

      {/* Rooms Card with Add Dialog */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Rooms</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
              </DialogHeader>
              <AddRoomForm propertyId={property._id} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {property.rooms?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.rooms.map((room, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    {room.imageUrl ? (
                      <Image
                        src={room.imageUrl}
                        alt={room.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImagePlus className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <ImagePlus className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground">No rooms added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetails;
