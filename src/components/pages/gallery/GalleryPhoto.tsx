"use client";
import { IGallery } from "@/interfaces/photos.interface";
import { Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const GalleryPhoto = ({
  photo,
  onClick,
}: {
  photo: IGallery;
  onClick: () => void;
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div
      className={`relative group cursor-pointer border w-full rounded-[30px] overflow-hidden aspect-square`}
      onClick={onClick}
    >
      <div className="bg-card w-full h-full flex items-center justify-center relative">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Image
          src={photo.imageUrl}
          alt={photo.caption || "Property image"}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
          width={300}
          height={300}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </div>

      {/* Caption Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {photo.caption && (
          <p className="text-white font-medium line-clamp-2">{photo.caption}</p>
        )}
        {photo.location && (
          <p className="text-white/90 text-sm flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {photo.location}
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryPhoto;
