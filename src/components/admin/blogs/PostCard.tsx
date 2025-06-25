import { IPost } from "@/interfaces/blog.interface";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const PostCard = ({ post }: { post: IPost }) => {
  return (
    <Card key={post._id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link href={`/admin/blogs/${post._id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        {post.image?.imageUrl && (
          <Image
            src={post.image.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded mt-2"
            width={300}
            height={300}
          />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt || post.content.substring(0, 200)}...
        </p>
        {post.tags && post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post?.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {post.isPublished ? "Published" : "Draft"}
        </span>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/blogs/${post._id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
