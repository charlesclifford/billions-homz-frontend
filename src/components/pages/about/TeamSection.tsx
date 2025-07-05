import SmallTitle from "@/components/shared/SmallTitle";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface IMember {
  name: string;
  position: string;
  photo: string;
}

const members: IMember[] = [
  {
    name: "John Doe",
    position: "CEO",
    photo:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/team-1.jpg",
  },
  {
    name: "Jane Smith",
    position: "CTO",
    photo:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/team-1.jpg",
  },
  {
    name: "Alice Johnson",
    position: "CFO",
    photo:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/team-1.jpg",
  },
  {
    name: "Bob Brown",
    position: "COO",
    photo:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/team-1.jpg",
  },
  {
    name: "Charlie Davis",
    position: "CMO",
    photo:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/team-1.jpg",
  },
  {
    name: "Eve Wilson",
    position: "CSO",
    photo:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/team-1.jpg",
  },
];

const TeamSection = () => {
  return (
    <div id="team" className="w-full about-section">
      <div className="w-full container max-w-[min(100%,1290px)] mx-auto px-4 pb-[150px] flex flex-col ">
        <SmallTitle text="meet the team" className="mx-auto" />

        <div className="max-w-full w-[760px] mx-auto text-center">
          <div className="mt-[30px] mb-[60px]">
            <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
              Global executive leadership
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] mb-[30px] z-[2]">
          {members.map(({ name, photo, position }, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "flex flex-col relative overflow-hidden group/card "
                )}
              >
                <div className="absolute right-0 top-0 z-[3]">
                  <div className="h-full">
                    <Link
                      href={"#"}
                      className="rounded-[30px] text-sm font-bold capitalize inline-grid relative group"
                    >
                      <span className="flex items-center flex-row-reverse justify-center">
                        <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary group-hover/card:text-white group-hover/card:bg-primary transition-all duration-300">
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
                    </Link>
                  </div>
                </div>

                {/* image */}
                <div className="relative">
                  <div className="pt-[122%] rounded-[30px] overflow-hidden relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full before:z-[1] before:opacity-0">
                    <Image
                      src={photo}
                      alt={name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover absolute top-0 left-0 group-hover/card:scale-[1.05] transition duration-300 ease"
                    />
                  </div>
                </div>

                {/* info */}
                <div className="flex flex-col items-center justify-center rounded-[20px] backdrop-blur-[30px] bg-black/5 border border-white/10 relative z-[4] mt-[-45px] mx-[45px] p-5">
                  <p className="font-semibold uppercase mb-1.5 leading-[1] text-white text-xs">
                    {position}
                  </p>
                  <h5 className="text-[26px] tracking-[0] leading-[1.23] font-bold">
                    {name}
                  </h5>
                </div>

                <div className="absolute top-0 right-0 w-[60px] h-[60px] ">
                  <div className="rounded-bl-[30px] w-full h-full bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute top-0 left-[-29.5px] rotate-180 bg-background"></div>
                  <div className="border-shape w-[30px] h-[30px] absolute right-[-0.5px] bottom-[-30px] rotate-180 bg-background"></div>
                </div>
                <div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
