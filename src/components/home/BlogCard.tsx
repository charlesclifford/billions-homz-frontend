import React from "react";
import { AnimatedLink } from "../shared/AnimatedLink";
import Image from "next/image";
import { cn } from "@/lib/utils";

const BlogCard = ({
  post,
  containerClassName,
}: {
  post: {
    id: number;
    title: string;
    tag: string;
    date: string;
    image: string;
  };
  containerClassName?: string;
}) => {
  return (
    <div key={post.id} className={cn("flex flex-col", containerClassName)}>
      <div className="mb-5 relative overflow-hidden rounded-[30px] group pt-[68.5%]">
        <Image
          src={post.image}
          alt="image"
          width={300}
          height={300}
          className="w-full h-full object-cover absolute top-0 left-0 group-hover:transform-[translate3d(0,0,0)_scale(1.2)] transform-[translate3d(-6.66%,0,0)_scale(1.2)] transition duration-300 ease-in-out"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-[30px] leading-[2] mb-[23px] relative before:content-[''] before:bg-gray-200 before:order-1 before:h-[1px] before:grow">
          <div className="bg-red-500 text-white py-[9px] px-5 rounded-[20px] leading-[1] font-semibold text-sm">
            <span>{post.tag}</span>
          </div>
          <div className="text-sm font-semibold leading-[1] order-2 text-gray-500">
            <span>{post.date}</span>
          </div>
        </div>
        <h3 className="text-[26px] leading-[1.23] tracking-[0] mb-[13px] font-bold">
          <AnimatedLink href="#">{post.title}</AnimatedLink>
        </h3>
      </div>
    </div>
  );
};

export default BlogCard;
