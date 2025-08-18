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
import { IProperty, IRoom } from "@/interfaces/property.interface";
import { deleteRoom } from "@/lib/api/properties";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RoomForm } from "./RoomForm";

const RoomActionsComp = ({
  room,
  propertyId,
}: {
  room: IRoom;
  propertyId: string;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditRoomDialogOpen, setIsEditRoomDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (data: IRoom) =>
      deleteRoom(propertyId, { roomName: data.name, publicId: data.publicId }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      setShowDeleteDialog(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to delete room");
      console.error("Delete error:", error);
    },
  });

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(room);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => setIsEditRoomDialogOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* edit room dialog */}
      <Dialog
        open={isEditRoomDialogOpen}
        onOpenChange={setIsEditRoomDialogOpen}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <RoomForm
            propertyId={propertyId}
            initialValues={room}
            onClose={() => setIsEditRoomDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete the room ${room.name}? This action cannot be undone.`}
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
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
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
    </div>
  );
};

const RoomCard = ({ room, property }: { room: IRoom; property: IProperty }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-2">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        {imageError || !room.imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <Image
              src={room.imageUrl}
              alt={room.name}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              priority={false}
            />
          </>
        )}
      </div>

      <div className="flex justify-between items-start">
        <p className="capitalize">{room.name}</p>

        <RoomActionsComp room={room} propertyId={property._id} />
      </div>
    </div>
  );
};

export default RoomCard;
