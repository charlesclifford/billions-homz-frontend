import SmallTitle from "@/components/shared/SmallTitle";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface IExploreList {
  id: string;
  title: string;
  content: string;
  containerClassName?: string;
  linkClassName?: string;
  link: {
    href: string;
    text: string;
  };
}

const exploreList: IExploreList[] = [
  {
    id: "01",
    title: "What we do",
    content:
      "We maintain this by ensuring transparency and professional conduct in every aspect.",
    link: {
      href: "#",
      text: "Our Solutions",
    },
    containerClassName: "bg-neutral-800 dark:bg-neutral-900 text-white",
    linkClassName: "before:!bg-white after:!bg-white",
  },
  {
    id: "02",
    title: "Our impact",
    content:
      "We work with both investors and developers to create landmarks that make an impact.",
    link: {
      href: "#",
      text: "See Projects",
    },
    containerClassName: "bg-primary text-white",
    linkClassName: "text-white before:!bg-white after:!bg-white",
  },
  {
    id: "03",
    title: "Core values",
    content:
      "To empower businesses with cutting-edge web solutions that enhance their digital presence and drive growth.",
    link: {
      href: "#",
      text: "Discover More",
    },
    containerClassName: "bg-neutral-800 dark:bg-neutral-900 text-white",
    linkClassName: "before:!bg-white after:!bg-white",
  },
];

const ExploreCompany = () => {
  return (
    <div className="footer about-section w-full">
      <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 py-[150px] flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_auto]">
          <div>
            <SmallTitle text="Explore company" />

            <div className="mt-[30px] mb-[45px]">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                Learn more about us
              </h2>
            </div>
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
          {exploreList.map((item, i) => {
            const {
              id,
              content,
              link,
              title,
              containerClassName,
              linkClassName,
            } = item;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-[30px] rounded-br-none min-h-[500px] p-[40px] pb-[60px] flex flex-col gap-[25px] justify-between relative",
                  "br-primary group/card",
                  containerClassName
                )}
              >
                <div className="absolute right-0 bottom-0 z-[3]">
                  <div className="h-full">
                    <div className="rounded-[30px] text-sm font-bold capitalize inline-grid relative group">
                      <span className="flex items-center flex-row-reverse justify-center">
                        <span
                          className={cn(
                            "w-[50px] h-[50px] rounded-full flex items-center justify-center group-hover/card:text-white group-hover/card:bg-primary transition-all duration-300",
                            "bg-primary"
                          )}
                        >
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
                        <span className=""></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className={cn("pb-[15px] border-b border-b-white")}>
                    <h6 className="text-[12px] font-semibold leading-[1] tracking-[0]">
                      {id}.
                    </h6>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="relative">
                    <div className="mb-2.5">
                      <h5 className="leading-[1] text-[36px] tracking-[-1px] font-bold">
                        {title}
                      </h5>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="mb-5">
                      <p className="">{content}</p>
                    </div>
                  </div>

                  <div>
                    <div className="">
                      <Link
                        href={link.href}
                        className={cn(
                          "relative text-sm font-bold leading-[1.7] capitalize contact-link",
                          linkClassName
                        )}
                      >
                        {link.text}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-[60px] h-[60px] ">
                  <div className="rounded-tl-[30px] w-full h-full bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute top-[-29.5px] right-[-0.5] -rotate-90 bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute left-[-29.5px] bottom-[-0.5] -rotate-90 bg-background"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreCompany;
