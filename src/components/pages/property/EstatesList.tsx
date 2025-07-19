import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const EstatesList = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={cn("rounded-[30px] relative", "group/card bg-pink-500")}
        >
          {/* thumbnail */}
          <div className="pt-[122%] relative rounded-[30px] group overflow-hidden">
            <Image
              src="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/faq-bc.jpg"
              alt=""
              width={500}
              height={500}
              className="w-full h-full object-cover absolute top-0 left-0 group-hover:transform-[translate3d(0,0,0)_scale(1.2)] transform-[translate3d(-6.66%,0,0)_scale(1.2)] transition duration-300 ease-in-out"
            />
          </div>
          {/* content */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end p-10 z-[3] text-white">
            {/* status */}
            <div></div>
            {/* location */}
            <div>location</div>
            {/* title */}
            <h4 className="">title</h4>
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
};

export default EstatesList;
