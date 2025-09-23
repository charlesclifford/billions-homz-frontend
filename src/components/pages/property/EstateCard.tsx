import { IEstate } from "@/interfaces/estate.interface";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EstateCard = ({ estate }: { estate: IEstate }) => {
  return (
    <div
      className={cn("rounded-[30px] relative overflow-hidden", "group/card")}
    >
      {/* thumbnail */}
      <div
        className="pt-[150%] relative rounded-[30px] group overflow-hidden after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-full after:opacity-90 after:z-[1]
    after:bg-gradient-to-t after:from-black/80 after:from-46.5% after:to-transparent"
      >
        <Image
          src={estate.bannerImage?.imageUrl || ""}
          alt={estate.name}
          width={500}
          height={500}
          className="w-full h-full object-cover absolute top-0 left-0 group-hover/card:transform-[translate3d(0,0,0)_scale(1.2)] transform-[translate3d(-6.66%,0,0)_scale(1.2)] transition duration-300 ease-in-out"
        />
      </div>

      {/* content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end p-8 z-[3] text-white">
        {/* status */}
        <div className="mb-auto">
          <span
            className={cn(
              "py-2.5 px-5 font-semibold text-xs leading-[1.25] uppercase rounded-[20px] inline-flex",
              estate.soldUnits === estate.totalUnits
                ? "bg-red-500/80 backdrop-blur-sm"
                : estate.soldUnits && estate.soldUnits > 0
                ? "bg-primary/80 backdrop-blur-sm"
                : "bg-background/80 backdrop-blur-sm text-black dark:text-white"
            )}
          >
            {estate.soldUnits === estate.totalUnits
              ? "Sold Out"
              : estate.soldUnits && estate.soldUnits > 0
              ? "Now Selling"
              : "Available"}
          </span>
        </div>
        {/* location */}
        <div className="border-b border-neutral-300 pb-5 mt-[30px] mb-[15px] flex items-center">
          <MapPin className="text-primary mr-1" />
          <span className="font-semibold leading-[1.5]">
            {estate.location.city}
          </span>
        </div>
        {/* title */}
        <h4 className="tracking-[-1px] text-[36px] font-bold">
          <Link
            href={`/listings/estates/${estate.slug}`}
            className="text-white hover:text-primary transition duration-300 ease-in-out line-clamp-2 capitalize text-shadow"
          >
            {estate.name}
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default EstateCard;
