"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProperty } from "@/interfaces/property.interface";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  GalleryThumbnailsIcon,
  XIcon,
  Eye,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PropertyImages = ({ property }: { property: IProperty }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    property.images?.map(() => true) || []
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedPhotoIndex(index);
  const closeModal = () => setSelectedPhotoIndex(null);
  const toggleThumbnail = () => setShowThumbnails(!showThumbnails);

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const handleImageError = (index: number) => {
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  // Sync main carousel and thumbnails
  useEffect(() => {
    if (!api || !thumbsApi) return;

    api.on("select", () => {
      const selected = api.selectedScrollSnap();
      setSelectedPhotoIndex(selected);
      thumbsApi.scrollTo(selected);
    });

    thumbsApi.on("select", () => {
      const selected = thumbsApi.selectedScrollSnap();
      setSelectedPhotoIndex(selected);
      api.scrollTo(selected);
    });
  }, [api, thumbsApi]);

  if (!property.images?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
          <ImagePlus className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">No images available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {property.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Loading state */}
              {loadingStates[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {/* Image */}
              <Image
                src={image.imageUrl}
                alt={`Property image ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300 cursor-pointer",
                  loadingStates[index] ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                priority={index < 3}
              />

              {/* Hover overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300",
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-background/80 hover:bg-background h-12 w-12 cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal with Carousel */}
        {selectedPhotoIndex !== null && (
          <div className="fixed inset-0 bg-black/85 flex flex-col items-center z-50">
            <header className="w-full flex items-center justify-end px-5 h-20">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white bg-black/50 hover:bg-black/75 hidden md:flex cursor-pointer rounded-full"
                  onClick={toggleThumbnail}
                >
                  <GalleryThumbnailsIcon className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white bg-black/50 hover:bg-black/75 cursor-pointer rounded-full"
                  onClick={closeModal}
                >
                  <XIcon className="size-6" />
                </Button>
              </div>
            </header>

            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                slidesToScroll: 1,
                startIndex: selectedPhotoIndex,
              }}
              className="w-full"
            >
              <CarouselContent
                className={cn(
                  "-ml-0 h-[calc(100dvh-80px)] transition-all duration-300 py-2",
                  showThumbnails
                    ? "md:h-[calc(100dvh-160px)]"
                    : "h-[calc(100dvh-80px)]"
                )}
              >
                {property.images.map((photo, i) => (
                  <CarouselItem
                    key={i}
                    className="px-2 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={photo.imageUrl}
                        alt={`Property image ${i + 1}`}
                        fill
                        className="object-contain"
                        priority={i < 3}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/75 hidden md:flex size-10 cursor-pointer" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/75 hidden md:flex size-10 cursor-pointer" />
            </Carousel>

            {/* Thumbnail Navigation */}
            <div
              className={cn(
                "w-full max-w-[calc(100vw-40px)] px-2 py-1 transition-all duration-300 overflow-hidden",
                showThumbnails ? "h-20 opacity-100" : "h-0 opacity-0",
                "hidden md:flex items-center justify-center"
              )}
            >
              <Carousel
                setApi={setThumbsApi}
                opts={{
                  align: "start",
                  dragFree: true,
                  containScroll: "keepSnaps",
                }}
                className="w-full"
              >
                <CarouselContent className="ml-0">
                  {property.images.map((photo, index) => (
                    <CarouselItem key={index} className="basis-20 pl-2">
                      <div
                        className={`relative h-16 rounded-md overflow-hidden cursor-pointer transition-all border-2 ${
                          selectedPhotoIndex === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() => {
                          setSelectedPhotoIndex(index);
                          api?.scrollTo(index);
                        }}
                      >
                        <Image
                          src={photo.imageUrl}
                          alt=""
                          fill
                          className={cn(
                            "object-cover transition-opacity duration-300",
                            selectedPhotoIndex === index ? "" : "opacity-50"
                          )}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyImages;
