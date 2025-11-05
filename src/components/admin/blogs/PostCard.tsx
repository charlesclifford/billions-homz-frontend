"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPost } from "@/interfaces/blog.interface";
import { deletePost } from "@/lib/api/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import BlogForm from "./BlogForm";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";

const PostCard = ({ post }: { post: IPost }) => {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: data?.message || "Post deleted successfully",
      });
      setShowDeleteDialog(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message:
          error.message ||
          error?.response?.data?.message ||
          "Failed to delete post",
      });
      console.error("Delete error:", error);
    },
  });

  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
    }
  };

  return (
    <>
      <div className="group relative">
        <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
          <Image
            src={post.image?.imageUrl as string}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <h3 className="text-lg font-bold group-hover:text-primary">
          {post.title}
        </h3>

        <div className="flex items-center justify-end gap-2 mt-2">
          <BlogForm initialValues={post}>
            <Button variant="outline" size="icon" className="cursor-pointer">
              <Edit className="h-4 w-4" />
            </Button>
          </BlogForm>
          <Button
            variant="destructive"
            size="icon"
            className="cursor-pointer"
            onClick={() => handleDeleteClick(post._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={confirmDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeedbackDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        actionLabel={dialog.type === "success" ? "Continue" : "Try Again"}
        onAction={() => {
          if (dialog.type === "success") {
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            setDialog((prev) => ({ ...prev, open: false }));
          } else {
            setDialog((prev) => ({ ...prev, open: false }));
          }
        }}
        allowOutsideInteraction={false}
        hideCloseButton
      />
    </>
  );
};

export default PostCard;
