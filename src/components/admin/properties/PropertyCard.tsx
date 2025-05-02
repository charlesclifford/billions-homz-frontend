"use client";
import { IProperty } from "@/interfaces/property.interface";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const PropertyCard = ({ property }: { property: IProperty }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video">
        <Image
          src={property.images[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 left-2">
          {/* {property?.listingType === "rent" ? "For Rent" : "For Sale"} */}
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium">{property.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-primary font-semibold">
            ${property.price.toLocaleString()}
            {/* {property?.listingType === "rent" && "/mo"} */}
          </span>
          <span className="text-sm text-muted-foreground">
            {property.bedrooms} beds
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {/* {property?.address} */}
        </p>
        <Button asChild variant="outline" className="w-full mt-2">
          <Link href={`/properties/${property._id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
