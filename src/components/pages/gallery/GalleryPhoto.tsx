"use client";
import { styled } from "styled-components";
import { GalleryImage } from "./GalleryGrid";
import Image from "next/image";
import { MapPin } from "lucide-react";

const GalleryPhoto = ({
  photo,
  onClick,
  rowSpan,
}: {
  photo: GalleryImage;
  onClick: () => void;
  rowSpan: number;
}) => {
  return (
    <PhotoContainer
      $rowSpan={rowSpan}
      className={`relative group cursor-pointer border`}
      onClick={onClick}
    >
      <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden">
        <Image
          src={photo.imageUrl}
          alt={photo.caption || "Property image"}
          className="w-full h-auto max-w-full max-h-full object-cover"
          loading="lazy"
          width={300}
          height={300}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: `${photo.width}/${photo.height}`,
          }}
        />
      </div>

      {/* Caption Overlay */}
      {(photo.caption || photo.location) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {photo.caption && (
            <p className="text-white font-medium line-clamp-2">
              {photo.caption}
            </p>
          )}
          {photo.location && (
            <p className="text-white/90 text-sm mt-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {photo.location}
            </p>
          )}
        </div>
      )}
    </PhotoContainer>
  );
};

export default GalleryPhoto;

const PhotoContainer = styled.div<{ $rowSpan: number }>`
  overflow: hidden;
  border-radius: 30px;
  grid-row-end: span ${(props) => props.$rowSpan};
`;
