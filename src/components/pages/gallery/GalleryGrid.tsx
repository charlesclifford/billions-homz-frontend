"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { UnsplashPhoto } from "@/interfaces/unsplash.interface";
import { GalleryThumbnailsIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import GalleryPhoto from "./GalleryPhoto";
import { cn } from "@/lib/utils";

const API_KEY = "PPt7y6rFoNU-S3o3VPJ-NRrNI--28s8BL0g_Lm55GnA";

const GalleryGrid = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();
  const [showThumbnails, setShowThumbnails] = useState(true);

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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("https://api.unsplash.com/photos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Client-ID ${API_KEY}`,
          },
        });
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full relative">
      {/* Main Gallery Grid */}
      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <GalleryPhoto
            key={photo.id}
            photo={photo}
            onClick={() => openModal(i)}
          />
        ))}
      </div>

      {/* Image Modal with Carousel */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/85 flex flex-col items-center z-50">
          <header className="w-full flex items-center justify-between px-5 h-20 absolute top-0 right-0 z-10">
            <div>
              <h4 className="text-white font-semibold text-lg">
                {photos[selectedPhotoIndex]?.user?.name}
              </h4>
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
                "w-[calc(100vw-20px)] h-dvh transition-all duration-300",
                showThumbnails ? "md:h-[calc(100dvh-104px)]" : "h-dvh"
              )}
            >
              {photos.map((photo) => (
                <CarouselItem
                  key={photo.id}
                  className="flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={photo.urls.regular}
                      alt={photo.alt_description || "Unsplash photo"}
                      fill
                      className="object-contain"
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
                  <CarouselItem key={photo.id} className="basis-20 pl-2">
                    <div
                      className={`relative h-16 rounded-md overflow-hidden cursor-pointer transition-all border-2 ${
                        selectedPhotoIndex === index
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                      onClick={() => {
                        setSelectedPhotoIndex(index);
                        api?.scrollTo(index);
                      }}
                    >
                      <Image
                        src={photo.urls.thumb}
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

export default GalleryGrid;
