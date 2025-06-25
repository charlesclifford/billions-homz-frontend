import SmallTitle from "@/components/shared/SmallTitle";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Buildings, RulerPen, Setting2 } from "iconsax-reactjs";

const AboutUsSection = () => {
  return (
    <>
      <div className="about-section w-full container mx-auto  mb-[80px] mt-[30px] lg:mt-[100px]">
        <div className="w-full max-w-[min(100%,1290px)] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-[30px] mb-[80px]">
          <div className="col-span-1">
            <SmallTitle text="About us" />

            <div className="max-w-full w-[520px]">
              <div className="mt-[30px]">
                <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-1px] lg:tracking-[-2px]">
                  Shaping the world of things to come
                </h2>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div>
              <div className="mb-5">
                <div className="text-[22px] font-semibold leading-[32px]">
                  We&apos;d love to share more with you, please complete this
                  form and our dedicated team will get back to you shortly.
                </div>
              </div>
            </div>
            <div>
              <div className="mb-10">
                <p className="text-lg leading-[28px]">
                  In markets from renewable energy, sports and entertainment, to
                  data centers and healthcare, we work to ensure the built
                  environment leaves a lasting positive impact. Together, we
                  strive to make your project better than you imagined possible.
                </p>
              </div>
            </div>
            <div>
              <div className="">
                <Link
                  href={"#team"}
                  className="p-[5px] pl-[30px] bg-white rounded-[30px] text-sm font-bold capitalize inline-grid relative group border transition duration-300"
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
                      meet the team
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section flex flex-col z-[1]">
        <div className="w-full max-w-[min(100%,1290px)] mx-auto px-4">
          <div className="bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/h2_img1.jpg)] bg-no-repeat bg-cover bg-center w-full h-full rounded-[30px] grid grid-cols-1 lg:grid-cols-2">
            <div>
              <div className="max-w-full relative w-[150px] lg:w-[220px]">
                <div className="bg-background rounded-br-[30px] w-full h-full">
                  <div className="w-full h-full">
                    <div className="h-full">
                      <div className="h-[60px]"></div>
                    </div>
                  </div>
                </div>
                {/* top-right */}
                <div className="bg-background w-[30px] h-[30px] absolute top-0 right-[-30px] rotate-90 border-shape"></div>
                {/* bottom-left */}
                <div className="bg-background w-[30px] h-[30px] absolute bottom-[-30px] left-0 rotate-90 border-shape"></div>
              </div>
            </div>
            <div className="lg:pt-[130px] pb-[60px] lg:pb-2.5 px-2.5  flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                <div className="min-h-[200px] lg:min-h-[250px]"></div>
                <div className="bg-[#f5f5f5] dark:bg-card min-h-[200px] lg:min-h-[250px] flex justify-between flex-col gap-5 rounded-[25px] p-[15px] lg:py-[30px] px-10">
                  {/* icon */}
                  <div className="">
                    <div className="flex items-center justify-end">
                      <Buildings size="56" color="#697689" variant="Bulk" />
                    </div>
                  </div>
                  {/* text */}
                  <div>
                    <div className="flex justify-center flex-col-reverse items-stretch">
                      <div className="flex items-center text-lg leading-[1.5em] text-neutral-600 dark:text-neutral-400">
                        projects in development
                      </div>
                      <div className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]">
                        {/* number prefix */}
                        <span className="text-end"></span>
                        <span className="">40</span>
                        {/* number suffix */}
                        <span className="text-start text-primary">
                          <sup>+</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f5f5f5] dark:bg-card min-h-[200px] lg:min-h-[250px] flex justify-between flex-col gap-5 rounded-[25px] p-[15px] lg:py-[30px] px-10">
                  {/* icon */}
                  <div className="">
                    <div className="flex items-center justify-end">
                      <RulerPen size="56" color="#697689" variant="Bulk" />
                    </div>
                  </div>
                  {/* text */}
                  <div>
                    <div className="flex justify-center flex-col-reverse items-stretch">
                      <div className="flex items-center text-lg leading-[1.5em] text-neutral-600 dark:text-neutral-400">
                        square feet of property
                      </div>
                      <div className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]">
                        {/* number prefix */}
                        <span className="text-end"></span>
                        <span className="">18m</span>
                        {/* number suffix */}
                        <span className="text-start text-primary">
                          <sup>+</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f5f5f5] dark:bg-card min-h-[200px] lg:min-h-[250px] flex justify-between flex-col gap-5 rounded-[25px] p-[15px] lg:py-[30px] px-10">
                  {/* icon */}
                  <div className="">
                    <div className="flex items-center justify-end">
                      <Setting2 size="56" color="#697689" variant="Bulk" />
                    </div>
                  </div>
                  {/* text */}
                  <div>
                    <div className="flex justify-center flex-col-reverse items-stretch">
                      <div className="flex items-center text-lg leading-[1.5em] text-neutral-600 dark:text-neutral-400">
                        total projects cost
                      </div>
                      <div className="text-[60px] flex text-center font-bold leading-[1.06em] tracking-[-2px]">
                        {/* number prefix */}
                        <span className="text-end"></span>
                        <span className="">2.5b</span>
                        {/* number suffix */}
                        <span className="text-start text-primary">
                          <sup>+</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsSection;
