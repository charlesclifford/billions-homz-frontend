import BlogsGrid from "@/components/pages/blogs/BlogsGrid";
import FeaturedPost from "@/components/pages/blogs/FeaturedPost";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import React from "react";

const BlogsPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader
        title="Our Blogs"
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog-bc.jpg"
      />

      <div className="w-full">
        <div className="mb-[60px] mt-10">
          <FeaturedPost />
        </div>
      </div>
      <Separator className="container max-w-[min(100%,1290px)] mx-auto" />
      <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
        <BlogsGrid />
      </div>
    </div>
  );
};

export default BlogsPage;
