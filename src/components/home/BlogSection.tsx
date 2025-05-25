import React from "react";
import SmallTitle from "../shared/SmallTitle";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { AnimatedLink } from "../shared/AnimatedLink";

const blogPosts = [
  {
    id: 1,
    title: "Are Sustainable Materials the Future of Homes?",
    tag: "Sustainability",
    date: "March 28, 2025",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog_12-1024x682.jpg",
  },
  {
    id: 2,
    title: "Minimalist Design Trends for Modern Living",
    tag: "Design",
    date: "March 25, 2025",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog_3-1024x682.jpg",
  },
  {
    id: 3,
    title: "Smart Home Technology Integration Guide",
    tag: "Technology",
    date: "March 22, 2025",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog_5-1024x647.jpg",
  },
];

const BlogSection = () => {
  return (
    <div className="about-section w-full container mx-auto px-4 bg-white">
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-[150px] flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <SmallTitle
              text="Articles & insights"
              className="mx-auto lg:mx-0"
            />

            <div className="mt-[30px] text-center lg:text-left">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                Discover inspiration and trends
              </h2>
            </div>
          </div>
          <div className="flex items-center lg:items-end justify-center lg:justify-end pb-2.5 pt-[30px]">
            <Link
              href={"/posts"}
              className="p-[5px] pl-[30px] border border-gray-300 rounded-[30px] text-sm font-bold capitalize inline-grid relative group hover:bg-gray-500 transition duration-300"
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
                <span className="inline-block text-black group-hover:text-white">
                  view All Posts
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-[60px] relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
            {blogPosts.map((post) => (
              <div key={post.id} className="mb-2.5 flex flex-col">
                <div className="mb-5 relative overflow-hidden rounded-[30px] group pt-[68.5%]">
                  <Image
                    src={
                      post.image
                    }
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
                    <AnimatedLink href="#">
                     {post.title}
                    </AnimatedLink>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
