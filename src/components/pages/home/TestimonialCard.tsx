import { ITestimonial } from "@/interfaces/testimonial.interface";
import { Play } from "iconsax-reactjs";
import Image from "next/image";
import React from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

interface TestimonialCardProps {
  item: ITestimonial;
  onVideoClick: (testimonial: ITestimonial) => void;
}

const TestimonialCard = ({ item, onVideoClick }: TestimonialCardProps) => {
  const { media, name, position, company, content } = item;

  const isVideo = item.media.type === "video";
  const isImage = item.media.type === "image";

  const handleMediaClick = () => {
    if (isVideo) {
      onVideoClick(item);
    }
  };

  return (
    <div className="rounded-[30px] bg-background relative h-fit">
      {/* icon */}
      <div className="absolute right-0 top-0 z-[2]">
        <div className="h-full">
          <div className="text-sm font-bold capitalize inline-grid relative group">
            <span className="flex items-center flex-row-reverse justify-center">
              <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white transition-all duration-300">
                <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                  <BiSolidQuoteAltLeft />
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="relative pt-[63%] min-w-[60px]"
        onClick={handleMediaClick}
      >
        <div className="absolute top-0 right-0 w-[60px] h-[60px] z-[1]">
          <div className="rounded-bl-[30px] w-full h-full bg-[#1b1f12]"></div>
          <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-[#1b1f12]"></div>
          <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-[#1b1f12]"></div>
        </div>

        {/* Media Display */}
        {isImage ? (
          <Image
            src={media?.url}
            alt="img"
            width={500}
            height={500}
            className="absolute left-0 top-0 object-cover w-full h-full transition duration-300 rounded-[30px]"
          />
        ) : isVideo ? (
          <div className="absolute left-0 top-0 w-full h-full group">
            <Image
              src={media?.thumbnailUrl || ""}
              alt="video"
              className="w-full h-full object-cover transition duration-300 rounded-[30px]"
              width={500}
              height={500}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all cursor-pointer rounded-[30px]">
              <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm transform group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Click to play
            </div>
          </div>
        ) : (
          <div className="absolute left-0 top-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No media</span>
          </div>
        )}
      </div>

      {/* content */}
      <div className="py-10 px-10">
        <div className="font-semibold leading-[1.45em] text-[22px] border-b border-b-neutral-200 pb-5 mb-5">
          <p>{content}</p>
        </div>
        <div className="flex flex-wrap">
          <div className="flex flex-col text-base">
            <span className="font-bold ">{name}</span>
            <span className="text-neutral-500 leading-[1.75]">
              {position}
              {company && ` at ${company}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
