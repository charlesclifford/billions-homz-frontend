import BlogsFilter from "@/components/admin/blogs/BlogsFilter";
import BlogsHeader from "@/components/admin/blogs/BlogsHeader";
import BlogsList from "@/components/admin/blogs/BlogsList";
import React from "react";

const BlogsPage = () => {
  return (
    <div className="w-full">
      <BlogsHeader />

      <div className="space-y-8">
        <BlogsFilter />

        <div className="w-full">
          <BlogsList />
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
