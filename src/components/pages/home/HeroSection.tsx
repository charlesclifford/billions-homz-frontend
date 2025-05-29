import React, { ReactNode } from "react";
import ServiceCard from "../../services/ServiceCard";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface IServiceList {
  icon: ReactNode;
  title: string;
  content: string;
}

const serviceList: IServiceList[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M4.265 7.999c0-2.057 1.674-3.734 3.734-3.734s3.734 1.674 3.734 3.734c0 2.057-1.674 3.734-3.734 3.734s-3.734-1.674-3.734-3.734zM0 7.999c0 4.418 3.581 7.999 7.999 7.999s7.999-3.581 7.999-7.999c0-4.418-3.581-7.999-7.999-7.999s-7.999 3.581-7.999 7.999z"></path>
        <path d="M0 24.001c0-4.418 3.581-7.999 7.999-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999s-7.999-3.583-7.999-7.999z"></path>
        <path d="M15.999 7.999c0-4.418 3.583-7.999 8.002-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999s-8.002-3.581-8.002-7.999z"></path>
        <path d="M20.266 24.001c0-2.057 1.674-3.734 3.734-3.734s3.734 1.674 3.734 3.734c0 2.060-1.674 3.734-3.734 3.734s-3.734-1.677-3.734-3.734zM15.999 24.001c0 4.418 3.581 7.999 7.999 7.999s7.999-3.581 7.999-7.999c0-4.418-3.581-7.999-7.999-7.999s-7.999 3.581-7.999 7.999z"></path>
      </svg>
    ),
    title: "High quality products",
    content:
      "The luxurious and exquisite design harmonious with the surrounding architecture provide the best living.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M24.001 5.333c-1.471 0-2.666 1.195-2.666 2.666s1.195 2.667 2.666 2.667 2.666-1.195 2.666-2.667h5.333c0 4.418-3.581 7.999-7.999 7.999s-7.999-3.581-7.999-7.999c-0.002-4.418 3.581-7.999 7.999-7.999v5.333z"></path>
        <path d="M5.333 7.999c0 1.471 1.195 2.667 2.666 2.667s2.667-1.195 2.667-2.667c0-1.471-1.195-2.666-2.667-2.666v-5.333c4.418 0 7.999 3.581 7.999 7.999s-3.581 7.999-7.999 7.999c-4.418 0-7.999-3.581-7.999-7.999h5.333z"></path>
        <path d="M26.667 24.001c0-1.471-1.195-2.667-2.666-2.667s-2.667 1.195-2.667 2.667c0 1.471 1.195 2.666 2.667 2.666v5.333c-4.418 0-7.999-3.581-7.999-7.999s3.581-7.999 7.999-7.999c4.418 0 7.999 3.581 7.999 7.999h-5.333z"></path>
        <path d="M7.999 26.667c1.471 0 2.667-1.195 2.667-2.666s-1.195-2.667-2.667-2.667c-1.471 0-2.666 1.195-2.666 2.667h-5.333c0-4.418 3.581-7.999 7.999-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999v-5.333z"></path>
      </svg>
    ),
    title: "Professional services",
    content:
      "The customer service center is ready to serve 24/7, support the residents to provide information.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M15.999 24.532c4.117 0 7.466 3.348 7.466 7.466h8.533c0-8.837-7.162-15.999-15.999-15.999s-15.999 7.165-15.999 16.001h8.533c0-4.117 3.348-7.468 7.466-7.468z"></path>
        <path d="M15.999 7.466c-4.117 0-7.466-3.348-7.466-7.466h-8.533c0 8.837 7.162 15.999 15.999 15.999s16.001-7.162 16.001-15.999h-8.533c0 4.117-3.351 7.466-7.468 7.466z"></path>
      </svg>
    ),
    title: "Real partnership",
    content:
      "We work with both investors and developers to create landmarks that make an impact.",
  },
];

const HeroSection = () => {
  return (
    <div className="h-full w-full bg-[url(/images/bg/h1_bg.jpg)] bg-no-repeat bg-cover bg-center relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full mb-[150px]">
      <div className="h-[50px] w-full absolute bottom-0 left-0">
        <div className="bg-white rounded-t-[50px] h-full w-full"></div>
      </div>

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 pt-[150px] lg:pt-[245px] relative">
        <div className="max-w-full w-[910px] mx-auto text-center self-center">
          <div className="mb-5">
            <h1 className="text-white font-bold text-[52px] lg:text-[90px] leading-[1]">
              Shaping future through excellence
            </h1>
          </div>
        </div>

        <div className="max-w-full w-[770px] mx-auto text-center self-center">
          <div className="mb-[50px] lg:mb-[125px]">
            <h1 className="text-neutral-300 font-semibold text-[22px] leading-[1]">
              We are a top 25 builder and developer fully invested in our
              customers&apos; success and improving the communities we serve.
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between max-w-full border-t border-t-neutral-400 py-[60px] lg:items-end items-center gap-8">
          <div className="w-[450px] lg:w-[660px] max-w-full">
            <div>
              <h4 className="text-white leading-[1] text-[32px] lg:text-4xl font-bold">
                We developed landmark real estate projects that deliver lasting
                value to investors and communities.
              </h4>
            </div>
          </div>
          <div className="max-w-full">
            <div className="">
              <Link
                href={"/about-us"}
                className="p-[5px] pl-[30px] bg-white rounded-[30px] text-sm font-bold capitalize inline-grid relative group"
              >
                <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
                  <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
                    <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                      {/* Top icon – animates out along 45deg */}
                      <span className="flex absolute items-center justify-center  transition-all duration-500 transform-3d transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] opacity-100 group-hover:transform-[translate3d(17px,-17px,0px)_scale3d(0.2,0.2,1)] group-hover:opacity-0">
                        <ArrowUpRight />
                      </span>

                      {/* Bottom icon – animates in along 45deg */}
                      <span className="flex absolute items-center justify-center  transition-all duration-500 transform-[translate3d(-17px,17px,0px)_scale3d(0.2,0.2,1)_rotate(-45deg)] opacity-0 group-hover:transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] group-hover:opacity-100">
                        <ArrowUpRight />
                      </span>
                    </span>
                  </span>
                  <span className="inline-block text-black ">
                    view services
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] z-[2]">
          {serviceList.map((item, i) => (
            <ServiceCard key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
