"use client";
import { getPaginationRange } from "@/components/shared/DataTable";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useGallery from "@/hooks/useGallery";
import { PhotosFilterInput } from "@/interfaces/photos.interface";
import { cn } from "@/lib/utils";
import { GalleryThumbnailsIcon, Loader2, MapPin, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AdminGalleryPhoto from "./AdminGalleryPhoto";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryList = () => {
  const [filter, setFilter] = useState<PhotosFilterInput>({
    page: 1,
    limit: 20,
  });
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [showThumbnails, setShowThumbnails] = useState(true);
  const { photos, isPending, totalPages } = useGallery(filter);
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>(
    {}
  );

  const openModal = (index: number) => setSelectedPhotoIndex(index);
  const closeModal = () => setSelectedPhotoIndex(null);

  const toggleThumbnail = () => {
    setShowThumbnails(!showThumbnails);
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

  const onPaginationChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageStartLoad = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="w-full relative">
      {/* Masonry Grid */}
      <>
        <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {isPending
            ? [...Array(filter.limit)].map((_, i) => (
                <div
                  key={i}
                  className="relative border w-full rounded-[30px] overflow-hidden aspect-square"
                >
                  <Skeleton className="w-full h-full rounded-[30px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex flex-col justify-end p-4">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-white/30" />
                    <Skeleton className="h-4 w-1/2 bg-white/30" />
                  </div>
                </div>
              ))
            : photos.map((photo, i) => {
                return (
                  <AdminGalleryPhoto
                    key={photo._id}
                    photo={photo}
                    onClick={() => openModal(i)}
                  />
                );
              })}
        </div>

        {!isPending && photos.length > 0 && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPaginationChange(filter?.page - 1)}
                  aria-disabled={filter.page === 1}
                  className={cn(
                    "cursor-pointer",
                    filter.page === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {getPaginationRange(filter.page, totalPages).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === filter.page}
                    onClick={() => onPaginationChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPaginationChange(filter.page + 1)}
                  aria-disabled={filter.page >= totalPages}
                  className={cn(
                    "cursor-pointer",
                    filter.page >= totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>

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
              {photos.map((photo, index) => (
                <CarouselItem
                  key={photo._id}
                  className="flex items-center justify-center px-0"
                >
                  <div className="relative w-full h-full">
                    {loadingImages[index] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-white/70" />
                      </div>
                    )}
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption || "photo"}
                      width={500}
                      height={500}
                      className={cn(
                        "w-full h-full object-contain transition-opacity duration-300",
                        loadingImages[index] ? "opacity-0" : "opacity-100"
                      )}
                      onLoad={() => handleImageLoad(index)}
                      onLoadingComplete={() => handleImageLoad(index)}
                      onLoadStart={() => handleImageStartLoad(index)}
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
      )}
    </div>
  );
};

export default GalleryList;
