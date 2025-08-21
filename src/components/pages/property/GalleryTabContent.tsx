"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IImage } from "@/interfaces/property.interface";
import { cn } from "@/lib/utils";
import { GalleryThumbnailsIcon, ImagePlus, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const GalleryTabContent = ({ images }: { images: IImage[] }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    images?.map(() => true) || []
  );
  const [mounted, setMounted] = useState(false);

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

  // Handle keyboard navigation
  useEffect(() => {
    if (!mounted) setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        api?.scrollNext();
      } else if (e.key === "ArrowLeft") {
        api?.scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, api, mounted]);

  // Preload images when modal opens
  useEffect(() => {
    if (selectedPhotoIndex !== null && images) {
      // Preload next and previous images for smoother navigation
      const preloadImages = [selectedPhotoIndex];
      if (selectedPhotoIndex > 0) preloadImages.push(selectedPhotoIndex - 1);
      if (selectedPhotoIndex < images.length - 1)
        preloadImages.push(selectedPhotoIndex + 1);

      preloadImages.forEach((index) => {
        const img = new window.Image();
        img.src = images[index].imageUrl;
      });
    }
  }, [selectedPhotoIndex, images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl">
        <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-3 pt-5 mb-4">
        <h2 className="text-4xl font-bold leading-tight tracking-[-0.015em]">
          Gallery
        </h2>
      </div>

      {/* Main Gallery Grid */}
      <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative rounded-[30px] overflow-hidden aspect-square group cursor-pointer bg-gray-100"
            onClick={() => openModal(idx)}
          >
            {loadingStates[idx] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
            <Image
              src={img.imageUrl}
              alt={img.caption || `Property image ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onLoad={() => handleImageLoad(idx)}
              onError={() => handleImageError(idx)}
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"></div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-4 py-2 rounded-full">
            {selectedPhotoIndex + 1} / {images.length}
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <Button
              size={"icon"}
              onClick={toggleThumbnail}
              className="text-white bg-black/50 hover:bg-black/75 hidden md:flex cursor-pointer rounded-full p-2 "
              aria-label={
                showThumbnails ? "Hide thumbnails" : "Show thumbnails"
              }
            >
              <GalleryThumbnailsIcon className="size-6" />
            </Button>
            <Button
              size={"icon"}
              onClick={closeModal}
              className="text-white bg-black/50 hover:bg-black/75 cursor-pointer rounded-full p-2 "
              aria-label="Close gallery"
            >
              <XIcon className="size-6" />
            </Button>
          </div>

          <div className="w-full h-full max-h-dvh flex flex-col">
            {/* Main Carousel */}
            <div className="relative flex-grow">
              <Carousel
                setApi={setApi}
                opts={{
                  slidesToScroll: 1,
                  startIndex: selectedPhotoIndex,
                }}
                className="w-full h-full"
              >
                <CarouselContent
                  className={cn(
                    "-ml-0 transition-all duration-300",
                    showThumbnails ? "h-dvh md:h-[calc(100dvh-112px)]" : "h-dvh"
                  )}
                >
                  {images.map((img, idx) => (
                    <CarouselItem
                      key={idx}
                      className="px-0 flex items-center justify-center h-full"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={img.imageUrl}
                          alt={img.caption || `Property image ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 80vw"
                          className="object-contain"
                          priority={idx === selectedPhotoIndex}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-3 rounded-full hover:bg-black/75 transition-colors z-10 disabled:hidden hidden md:flex border-transparent hover:text-white cursor-pointer size-10" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-3 rounded-full hover:bg-black/75 transition-colors z-10 disabled:hidden hidden md:flex border-transparent hover:text-white cursor-pointer size-10" />
              </Carousel>
            </div>

            {/* Thumbnail Carousel */}
            <div
              className={cn(
                "mt-4 h-24 transition-all duration-300 overflow-hidden hidden md:flex",
                showThumbnails ? "h-24" : "h-0"
              )}
            >
              <Carousel
                setApi={setThumbsApi}
                opts={{ containScroll: "keepSnaps", dragFree: true }}
                className="w-full"
              >
                <CarouselContent className="ml-0">
                  {images.map((img, idx) => (
                    <CarouselItem
                      key={idx}
                      className="basis-24 pl-2 cursor-pointer"
                      onClick={() => {
                        setSelectedPhotoIndex(idx);
                        api?.scrollTo(idx);
                      }}
                    >
                      <div
                        className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                          selectedPhotoIndex === idx
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img.imageUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="96px"
                          className={cn(
                            "object-cover transition-opacity duration-300",
                            selectedPhotoIndex === idx ? "" : "opacity-50"
                          )}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTabContent;
