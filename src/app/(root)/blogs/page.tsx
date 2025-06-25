import React from "react";

const BlogsPage = () => {
  return (
    <div className="w-full h-full">
      <div className="bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog-bc.jpg)] bg-no-repeat bg-cover bg-center w-full h-full relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full">
        <div className="relative container mx-auto pt-[175px] pb-10 px-[30px] flex flex-col">
          <div>
            <div className="mb-[150px]">
              <h2 className="font-bold text-[52px] lg:text-[90px] leading-[1.06em] tracking-[-2px] text-white">
                Our Blogs
              </h2>
            </div>
          </div>
          <div></div>
        </div>

        <div className="h-[50px] w-full absolute bottom-0 left-0">
          <div className="bg-background rounded-t-[50px] h-full w-full"></div>
        </div>
      </div>

    </div>
  );
};

export default BlogsPage;
