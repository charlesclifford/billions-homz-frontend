"use client";
import { UnsplashPhoto } from "@/interfaces/unsplash.interface";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

const GalleryPhoto = ({
  photo,
  onClick,
}: {
  photo: UnsplashPhoto;
  onClick: () => void;
}) => {
  const { urls, alt_description, height, width } = photo;
  const [rowSpan, setRowSpan] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const calculateRowSpan = () => {
      if (imgRef.current) {
        const containerWidth = imgRef.current.parentElement?.clientWidth || 250;
        const aspectRatio =
          imgRef.current.naturalHeight / imgRef.current.naturalWidth;
        const calculatedHeight = containerWidth * aspectRatio;
        const rowGap = 10;
        const baseRowHeight = 10;

        setRowSpan(
          Math.ceil((calculatedHeight + rowGap) / (baseRowHeight + rowGap))
        );
      }
    };

    if (imgRef.current) {
      imgRef.current.onload = calculateRowSpan;
    }
  }, []);

  return (
    <PhotoContainer $rowSpan={rowSpan} className="group/card cursor-pointer" onClick={onClick}>
      <div className="w-full h-full block">
        <Image
          ref={imgRef}
          src={urls.regular}
          alt={alt_description}
          width={width}
          height={height}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 flex flex-col justify-end h-1/2 bg-gradient-to-t from-black to-transparent transition-opacity duration-500 ease-in-out group-hover/card:opacity-100">
        <div className="flex flex-col text-white">
          <p className="font-semibold text-lg">{photo.user.name}</p>
          <p className="text-sm">{photo.user.location}</p>
        </div>
      </div>
    </PhotoContainer>
  );
};

export default GalleryPhoto;

const PhotoContainer = styled.div<{ $rowSpan: number }>`
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  grid-row-end: span ${(props) => props.$rowSpan};
  height: auto;
`;
