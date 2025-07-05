import { IPost } from "@/interfaces/blog.interface";
import { formatDate } from "date-fns";
import { CalendarDays, Clock, Tag } from "lucide-react";
import Image from "next/image";
import React from "react";

const BlogPostHeader = ({ post }: { post: IPost }) => {
  return (
    <div className="relative h-96 w-full md:h-[500px]">
      <Image
        src={post.image?.imageUrl || ""}
        alt={post.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 relative z-[1] flex h-full items-end pb-8 lg:pb-12 text-white">
        <div className="max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl capitalize">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {post.publishedAt && (
              <span className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                {formatDate(new Date(post.publishedAt), "MMMM d, yyyy")}
              </span>
            )}

            {post.readTime !== 0 && post.readTime && (
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" /> {post.readTime} min read
              </span>
            )}
            {post.tags?.map((tag) => (
              <span key={tag} className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostHeader;
