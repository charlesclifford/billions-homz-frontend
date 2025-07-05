import { cn } from "@/lib/utils";
import React from "react";

const PageHeader = ({
  title,
  bgImage,
  className = "",
}: {
  title: string;
  bgImage: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        ` bg-no-repeat bg-cover bg-center w-full h-full relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full`,
        className
      )}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative container mx-auto pt-[175px] pb-10 px-[30px] flex flex-col">
        <div>
          <div className="mb-[150px]">
            <h2 className="font-bold text-[52px] lg:text-[90px] leading-[1.06em] tracking-[-2px] text-white capitalize">
              {title}
            </h2>
          </div>
        </div>
        <div></div>
      </div>

      <div className="h-[50px] w-full absolute bottom-0 left-0">
        <div className="bg-background rounded-t-[50px] h-full w-full"></div>
      </div>
    </div>
  );
};

export default PageHeader;
