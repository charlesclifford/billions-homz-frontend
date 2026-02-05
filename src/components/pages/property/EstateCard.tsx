import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { IEstate } from "@/interfaces/estate.interface";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const EstateCard = ({ estate }: { estate: IEstate }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: favorites, toggleFavorite } = useFavorites();

  const isFavorited =
    favorites?.estates?.some((e) => e._id === estate._id) ?? false;

  const onFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite({ type: "estate", id: estate._id });
  };

  const isSoldOut = estate.soldUnits === estate.totalUnits;
  const isSelling = estate.soldUnits && estate.soldUnits > 0 && !isSoldOut;

  const getStatus = () => {
    if (isSoldOut) return "Sold Out";
    if (isSelling) return "Now Selling";
    return "Available";
  };

  const isNew = (() => {
    if (!estate.createdAt) return false;
    const created = new Date(estate.createdAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7; // visible for 1 weeks
  })();

  return (
    <div
      className={cn("rounded-[30px] relative overflow-hidden", "group/card")}
    >
      {/* New Badge */}
      {isNew && (
        <Badge
          variant="secondary"
          className="absolute top-14 left-4 py-2.5 px-5 rounded-[20px] bg-primary backdrop-blur-sm z-10"
        >
          New
        </Badge>
      )}

      {user && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              onClick={onFavoriteToggle}
              className={cn(
                "absolute top-4 right-4 z-30 rounded-full w-9 h-9 transition-all duration-200",
                isFavorited
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-background/80 backdrop-blur-sm hover:bg-background/90"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isFavorited
                    ? "fill-current scale-110"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFavorited ? "Remove from favorites" : "Add to favorites"}
          </TooltipContent>
        </Tooltip>
      )}

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
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end p-4 z-[3] text-white">
        {/* status */}
        <div className="mb-auto">
          <span
            className={cn(
              "py-2.5 px-5 font-semibold text-xs leading-[1.25] uppercase rounded-[20px] inline-flex",
              isSoldOut
                ? "bg-red-500/80 backdrop-blur-sm"
                : isSelling
                ? "bg-primary/80 backdrop-blur-sm"
                : "bg-background/80 backdrop-blur-sm text-black dark:text-white"
            )}
          >
            {getStatus()}
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
