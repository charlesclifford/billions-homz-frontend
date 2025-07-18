import BlogsGrid from "@/components/pages/blogs/BlogsGrid";
import FeaturedPost from "@/components/pages/blogs/FeaturedPost";
import PageHeader from "@/components/shared/PageHeader";
import React from "react";

const BlogsPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader
        title="Our Blogs"
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog-bc.jpg"
      />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
        <div>
          <div className="mb-[60px] mt-10">
            <div>
              <FeaturedPost />
            </div>
          </div>
        </div>
        <BlogsGrid />
      </div>
    </div>
  );
};

export default BlogsPage;
