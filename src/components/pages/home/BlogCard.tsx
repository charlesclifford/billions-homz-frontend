import React from "react";
import { AnimatedLink } from "../../shared/AnimatedLink";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IPost } from "@/interfaces/blog.interface";
import { formatDate } from "date-fns";
import Link from "next/link";

const BlogCard = ({
  post,
  containerClassName,
}: {
  post: IPost;
  containerClassName?: string;
}) => {
  return (
    <div className={cn("flex flex-col", containerClassName)}>
      <Link href={`/post/${post.slug}`}>
        <div className="mb-5 relative overflow-hidden rounded-[30px] group pt-[68.5%]">
          <Image
            src={post.image?.imageUrl || ""}
            alt={post.title || "Blog post image"}
            width={300}
            height={300}
            className="w-full h-full object-cover absolute top-0 left-0 group-hover:transform-[translate3d(0,0,0)_scale(1.2)] transform-[translate3d(-6.66%,0,0)_scale(1.2)] transition duration-300 ease-in-out"
          />
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-between gap-[30px] leading-[2] mb-[23px] relative before:content-[''] before:bg-border before:order-1 before:h-[1px] before:grow">
          {post.tags && post.tags?.length > 0 && (
            <div className="bg-primary text-white py-[6px] px-4 rounded-[20px] leading-[1] font-semibold text-xs">
              <span>{post.tags[0]}</span>
            </div>
          )}
          <div className="text-sm font-semibold leading-[1] order-2 text-gray-500">
            <span>
              {post.createdAt
                ? formatDate(new Date(post?.publishedAt), "MMM dd, yyyy")
                : ""}
            </span>
          </div>
        </div>
        <h3 className="text-[26px] leading-[1.23] tracking-[0] mb-[13px] font-bold">
          <AnimatedLink href={`/post/${post.slug}`}>{post.title}</AnimatedLink>
        </h3>
        <span className="line-clamp-2">{post.excerpt}</span>
      </div>
    </div>
  );
};

export default BlogCard;
