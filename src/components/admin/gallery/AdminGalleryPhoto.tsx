"use client";
import PhotoUploader from "@/components/admin/gallery/PhotoUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IGallery } from "@/interfaces/photos.interface";
import { deletePhoto } from "@/lib/api/gallery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Loader2, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AdminGalleryPhoto = ({
  photo,
  onClick,
}: {
  photo: IGallery;
  onClick: () => void;
}) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const isAdminRoute = pathname.startsWith("/admin");

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const deletePostMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: (data) => {
      toast.success(data.message || "Photo deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos-infinite"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to delete post");
      console.error("Delete error:", error);
    },
  });

  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
    }
  };

  return (
    <div className="relative group border w-full rounded-[30px] overflow-hidden aspect-square">
      <div className="bg-gray-100 w-full h-full flex items-center justify-center ">
        <Image
          src={photo.imageUrl}
          alt={photo.caption || "Property image"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width={300}
          height={300}
        />
      </div>

      {/* Caption Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4  transition-opacity duration-300">
        {photo.caption && (
          <p className="text-white font-medium line-clamp-2">{photo.caption}</p>
        )}
        {photo.location && (
          <p className="text-white/90 text-sm mt-1 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {photo.location}
          </p>
        )}
      </div>

      {isAdminRoute && (
        <div className="absolute top-2 right-4 flex items-center gap-2 mt-2">
          <Button size="icon" className="cursor-pointer" onClick={onClick}>
            <Eye className="h-4 w-4" />
          </Button>

          <PhotoUploader initialValues={photo}>
            <Button
              size="icon"
              className="cursor-pointer bg-white text-black hover:bg-white/90"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </PhotoUploader>
          <Button
            size="icon"
            className="cursor-pointer bg-red-500 hover:bg-red-600"
            onClick={() => handleDeleteClick(photo._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Photo</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this photo? This action cannot
                  be undone.
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPhoto;


