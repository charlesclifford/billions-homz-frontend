import { cn } from "@/lib/utils";
import React from "react";

const SmallTitle = ({
  text,
  className,
  borderClass,
}: {
  text: string;
  className?: string;
  borderClass?: string;
}) => {
  return (
    <div className={cn("max-w-full w-[130px]", className)}>
      <div
        className={cn(
          "py-0.5 px-5 border border-primary rounded-[20px]",
          borderClass
        )}
      >
        {/* Marquee wrapper */}
        <div className="relative w-full overflow-hidden">
          {/* Marquee content */}
          <div className="animate-marquee whitespace-nowrap font-semibold uppercase text-[12px] py-[1px]">
            <span className="px-[5px] inline-flex items-center">{text}</span>
            <span className="px-[5px] inline-flex items-center">·</span>
            <span className="px-[5px] inline-flex items-center">{text}</span>
            <span className="px-[5px] inline-flex items-center">·</span>
            {/* Duplicate for seamless looping */}
            <span className="px-[5px] inline-flex items-center">{text}</span>
            <span className="px-[5px] inline-flex items-center">·</span>
            <span className="px-[5px] inline-flex items-center">{text}</span>
            <span className="px-[5px] inline-flex items-center">·</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallTitle;
