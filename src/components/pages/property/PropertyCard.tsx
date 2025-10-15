"use client";

import { AnimatedLink } from "@/components/shared/AnimatedLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import { IProperty } from "@/interfaces/property.interface";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { CameraIcon, Heart, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface PropertyCardProps {
  property: IProperty;
}

// Helper function for property details
// const detailItem = (
//   icon: React.ReactNode,
//   label: string,
//   value: number | string
// ) => (
//   <div className="flex items-center gap-1 text-sm">
//     {icon}
//     <span className="text-muted-foreground">
//       {value} {label}
//     </span>
//   </div>
// );

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { user } = useAppSelector((state) => state.auth);
  const { data: favorites, toggleFavorite } = useFavorites();

  // Update current index when slide changes
  const onSelect = () => {
    if (api) {
      setCurrentIndex(api.selectedScrollSnap());
    }
  };

  // Initialize carousel API
  useEffect(() => {
    if (api) {
      api.on("select", onSelect);
      return () => {
        api.off("select", onSelect);
      };
    }
  }, [api]);

  const isFavorited = useMemo(() => {
    return favorites?.properties?.some((p) => p._id === property._id);
  }, [favorites, property._id]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite({ type: "property", id: property._id });
  };

  const isNew = (() => {
    if (!property.createdAt) return false;
    const created = new Date(property.createdAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  return (
    <div className="overflow-hidden transition-all duration-300 flex flex-col h-auto group relative">
      {/* Image Carousel */}
      <div className="relative w-full rounded-[30px] overflow-hidden mb-5 border">
        {property?.images?.length > 0 ? (
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {property.images.slice(0, 4).map((img, index) => (
                <CarouselItem key={index} className="h-full px-0">
                  <div className="relative w-full pt-[68.5%]">
                    <Image
                      src={img.imageUrl}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        imageLoading ? "opacity-0" : "opacity-100"
                      )}
                      onLoad={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation arrows */}
            {property.images.length > 1 && (
              <>
                <CarouselPrevious className="-left-10 group-hover:left-4 transition-all duration-300 !bg-primary border-transparent cursor-pointer w-10 h-10 text-white" />
                <CarouselNext className="-right-10 group-hover:right-4 transition-all duration-300 !bg-primary border-transparent cursor-pointer w-10 h-10 text-white" />
              </>
            )}

            {/* Dots indicator */}
            {property.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                {property.images.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer border-input ${
                      currentIndex === index
                        ? "bg-primary w-8"
                        : "bg-white/70 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-[300px] bg-muted flex items-center justify-center text-muted-foreground">
            <CameraIcon className="w-8 h-8" />
          </div>
        )}

        {/* ❤️ Favorite button */}
        {user && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleFavorite}
                className={cn(
                  "absolute top-4 right-4 z-20 rounded-full w-9 h-9 transition-colors",
                  isFavorited
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-background/80 backdrop-blur-sm hover:bg-background/90"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isFavorited
                      ? "fill-current scale-110"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorited ? "Remove from favorites" : "Add to favorites"}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 py-2.5 px-5 rounded-[20px] text-xs capitalize bg-background/80 backdrop-blur-sm">
          {property.status}
        </div>

        {/* New Badge */}
        {isNew && (
          <Badge
            variant="secondary"
            className="absolute top-14 left-4 py-2.5 px-5 rounded-[20px] bg-primary backdrop-blur-sm"
          >
            New
          </Badge>
        )}
      </div>

      {/* Property Info */}
      <div className="flex flex-col flex-1">
        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">{property.location?.city}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2 mb-2 capitalize">
          <AnimatedLink href={`/listings/properties/${property.slug}`}>
            {property.title}
          </AnimatedLink>
        </h3>

        {/* Price */}
        <p className="text-primary font-bold text-xl mb-3">
          {formatCurrency(property.price)}
        </p>

        {/* Property Details */}
        {/* <div className="flex flex-wrap gap-3 text-muted-foreground">
          {detailItem(
            <Bed className="w4 h-4" />,
            "Beds",
            property.bedrooms || 0
          )}
          {detailItem(
            <Bath className="w-4 h-4" />,
            "Baths",
            property.bathrooms || 0
          )}
          {detailItem(
            <SquareDotIcon className="w-4 h-4" />,
            "Sq Ft",
            property.dimensions || "N/A"
          )}
        </div> */}
      </div>
    </div>
  );
};

export default PropertyCard;
