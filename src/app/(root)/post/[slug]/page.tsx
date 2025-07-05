import PostContent from "@/components/pages/blogs/PostContent";
import { IPost } from "@/interfaces/blog.interface";
import { getAllPosts, getPostBySlug } from "@/lib/api/blog";
import { config } from "@/utils/config";
import { notFound } from "next/navigation";
import React from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  try {
    const { slug } = await params;
    const data = await getPostBySlug(slug);
    const post = data.data as IPost;

    return {
      title: post.title,
      description: post.excerpt,
      canonical: `${config.SITE_URL}/posts/${post.slug}`,
      openGraph: {
        type: "website",
        url: `${config.SITE_URL}/posts/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        images: [
          {
            url: post.image?.imageUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        cardType: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        image: post.image?.imageUrl,
      },
    };
  } catch (error) {
    console.log(error);
    notFound();
  }
};

export const generateStaticParams = async () => {
  let posts = [];
  try {
    const data = await getAllPosts({
      limit: 100,
      page: 1,
      isPublished: true,
    });

    posts = data.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return posts.map((post: any) => ({
      // id: post?._id,
      slug: post?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SinglePostPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const data = await getPostBySlug(slug);
  const post = data.data as IPost;

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <PostContent post={post} />
    </div>
  );
};

export default SinglePostPage;
