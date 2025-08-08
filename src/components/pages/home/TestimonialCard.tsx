import Image from "next/image";
import React from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

const TestimonialCard = ({
  item,
}: {
  item: {
    id: number;
    quote: string;
    name: string;
    role: string;
    image: string;
  };
}) => {
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

      <div className="relative pt-[63%] min-w-[60px] ">
        <div className="absolute top-0 right-0 w-[60px] h-[60px] z-[1]">
          <div className="rounded-bl-[30px] w-full h-full bg-[#1b1f12]"></div>
          <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-[#1b1f12]"></div>
          <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-[#1b1f12]"></div>
        </div>

        {/* image */}
        <Image
          src={item.image}
          alt="img"
          width={500}
          height={500}
          className="absolute left-0 top-0 object-cover w-full h-full transition duration-300 rounded-[30px]"
        />
      </div>

      {/* content */}
      <div className="py-10 px-10">
        <div className="font-semibold leading-[1.45em] text-[22px] border-b border-b-neutral-200 pb-5 mb-5">
          <p>{item.quote}</p>
        </div>
        <div className="flex flex-wrap">
          <div className="flex flex-col text-base">
            <span className="font-bold ">{item.name}</span>
            <span className="text-neutral-500 leading-[1.75]">{item.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
