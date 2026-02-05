"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import useGallery from "@/hooks/useGallery";
import { cn } from "@/lib/utils";
import { GalleryThumbnailsIcon, MapPin, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GalleryPhoto from "./GalleryPhoto";

const GalleryGrid = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [showThumbnails, setShowThumbnails] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    infiniteQuery: { photos, isLoadingInfinite, isFetchingNextPage },
    hasMore,
    loadMore,
  } = useGallery({ page: 1, limit: 20 });

  const openModal = (index: number) => setSelectedPhotoIndex(index);
  const closeModal = () => setSelectedPhotoIndex(null);
  const toggleThumbnail = () => {
    setShowThumbnails(!showThumbnails);
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isFetchingNextPage, loadMore]);

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

  return (
    <div className="w-full relative">
      {isLoadingInfinite && photos.length === 0 ? (
        <div className="w-full grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="relative border w-full rounded-[30px] overflow-hidden aspect-square"
            >
              <Skeleton className="w-full h-full rounded-[30px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex flex-col justify-end p-4">
                {/* <Skeleton className="h-6 w-3/4 mb-2 bg-white/30" />
                <Skeleton className="h-4 w-1/2 bg-white/30" /> */}
              </div>
            </div>
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div>
          {/* Masonry Grid */}
          <div className="w-full grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {photos.map((photo, i) => {
              return (
                <GalleryPhoto
                  key={photo._id}
                  photo={photo}
                  onClick={() => openModal(i)}
                />
              );
            })}

            {isFetchingNextPage && (
              <>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="relative border w-full rounded-[30px] overflow-hidden aspect-square"
                  >
                    <Skeleton className="w-full h-full rounded-[30px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex flex-col justify-end p-4">
                      {/* <Skeleton className="h-6 w-3/4 mb-2 bg-white/30" />
                      <Skeleton className="h-4 w-1/2 bg-white/30" /> */}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={loaderRef} className="h-10 w-full" />
        </div>
      ) : (
        <div className="flex justify-center items-center h-40 text-muted-foreground">
          No photos yet.
        </div>
      )}

      {/* Image Modal with Carousel */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center z-50">
          <header className="w-full flex items-center justify-between px-5 h-20">
            <div>
              <h4 className="text-white font-semibold leading-4">
                {photos[selectedPhotoIndex]?.caption}
              </h4>
              {photos[selectedPhotoIndex]?.location && (
                <span className="text-white/90 text-sm mt-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {photos[selectedPhotoIndex]?.location}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                className="text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors hidden md:flex cursor-pointer"
                onClick={toggleThumbnail}
              >
                <GalleryThumbnailsIcon className="size-6" />
              </button>
              <button
                className="text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors cursor-pointer"
                onClick={closeModal}
              >
                <XIcon className="size-6" />
              </button>
            </div>
          </header>

          <div className="">
            <Carousel
              setApi={setApi}
              opts={{
                startIndex: selectedPhotoIndex,
              }}
            >
              <CarouselContent
                className={cn(
                  "-ml-0 transition-all duration-300 py-2",
                  showThumbnails
                    ? "h-[calc(100dvh-80px)] md:h-[calc(100dvh-160px)]"
                    : "h-[calc(100dvh-80px)]"
                )}
              >
                {photos.map((photo) => (
                  <CarouselItem
                    key={photo._id}
                    className="flex items-center justify-center px-0"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.caption || "photo"}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-3 rounded-full hover:bg-black/75 transition-colors z-10 disabled:hidden hidden md:flex border-transparent hover:text-white cursor-pointer size-10" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-3 rounded-full hover:bg-black/75 transition-colors z-10 disabled:hidden hidden md:flex border-transparent hover:text-white cursor-pointer size-10" />
            </Carousel>

            {/* Thumbnail Navigation */}
            <div
              className={cn(
                "w-full max-w-[calc(100vw-40px)] px-2 py-1 transition-all duration-300 overflow-hidden hidden md:flex",
                showThumbnails ? "h-20 opacity-100" : "h-0 opacity-0",
                "md:flex items-center justify-center"
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
                  {photos.map((photo, index) => (
                    <CarouselItem key={photo._id} className="basis-20 pl-2">
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
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
