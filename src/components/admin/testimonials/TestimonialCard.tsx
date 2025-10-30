"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { testimonialKeys } from "@/hooks/useTestimonials";
import { ITestimonial } from "@/interfaces/testimonial.interface";
import { toggleActive, toggleFeatured } from "@/lib/api/testimonials";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { formatDate } from "date-fns";
import {
  Edit,
  Expand,
  Eye,
  EyeOff,
  ImageIcon,
  Play,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { UpdateTestimonialForm } from "./UpdateTestimonialForm";
import { UpdateTestimonialMediaForm } from "./updateTestimonialMediaForm";

// Testimonial Card Component
export const TestimonialCard = ({
  testimonial,
  onPreview,
}: {
  testimonial: ITestimonial;
  onPreview: (testimonial: ITestimonial) => void;
}) => {
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState<{
    open: boolean;
    testimonial: ITestimonial | null;
  }>({
    open: false,
    testimonial: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    testimonial: ITestimonial | null;
  }>({
    open: false,
    testimonial: null,
  });
  const [editMediaModal, setEditMediaModal] = useState<{
    open: boolean;
    testimonial: ITestimonial | null;
  }>({
    open: false,
    testimonial: null,
  });

  const openEdit = (testimonial: ITestimonial) => {
    setEditModal({
      open: true,
      testimonial: testimonial,
    });
  };

  const closeEdit = () => {
    setEditModal({
      open: false,
      testimonial: null,
    });
  };

  const openDelete = (testimonial: ITestimonial) => {
    setDeleteModal({
      open: true,
      testimonial: testimonial,
    });
  };

  const closeDelete = () => {
    setDeleteModal({
      open: false,
      testimonial: null,
    });
  };

  const openEditMedia = (testimonial: ITestimonial) => {
    setEditMediaModal({
      open: true,
      testimonial: testimonial,
    });
  };

  const closeEditMedia = () => {
    setEditMediaModal({
      open: false,
      testimonial: null,
    });
  };

  const handleEditSuccess = () => {
    closeEdit();
  };

  const isVideo = testimonial.media?.type === "video";
  const isImage = testimonial.media?.type === "image";

  const toggleFeaturedMutation = useMutation({
    mutationFn: toggleFeatured,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonialKeys.featured() });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(variables),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      toast.error(
        error.response?.data.message || "Failed to toggle featured status."
      );
    },
  });
  const toggleActiveMutation = useMutation({
    mutationFn: toggleActive,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonialKeys.featured() });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(variables),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      toast.error(
        error.response?.data.message || "Failed to toggle active status."
      );
    },
  });

  const handleToggleFeatured = () => {
    toggleFeaturedMutation.mutate(testimonial._id);
  };

  const handleToggleActive = () => {
    toggleActiveMutation.mutate(testimonial._id);
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg",
          !testimonial.isActive && "opacity-60"
        )}
      >
        <CardHeader className="">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{testimonial.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {testimonial.position}
                {testimonial.company && ` • ${testimonial.company}`}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Featured toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleToggleFeatured}
                    disabled={toggleFeaturedMutation.isPending}
                    className={cn(
                      "",
                      testimonial.isFeatured &&
                        "text-yellow-600 hover:text-yellow-700"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-3 w-3",
                        testimonial.isFeatured && "fill-current"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {testimonial.isFeatured
                    ? "Unmark as Featured"
                    : "Mark as Featured"}
                </TooltipContent>
              </Tooltip>

              {/* Active toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleToggleActive}
                    disabled={toggleActiveMutation.isPending}
                  >
                    {testimonial.isActive ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {testimonial.isActive ? "Deactivate" : "Activate"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Media Preview */}
          <div
            className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onPreview(testimonial)}
          >
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  src={testimonial.media.url}
                  poster={testimonial.media.thumbnailUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                  <div className="bg-black/50 rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ) : isImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={testimonial.media.url}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <p className=" line-clamp-2 text-ellipsis">
              &quot;{testimonial.content}&quot;
            </p>
          </div>

          {/* Metadata */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {testimonial.media?.format?.toUpperCase()} •{" "}
              {testimonial.media?.size &&
                formatFileSize(testimonial.media.size)}
            </span>
            <span>{formatDate(testimonial.createdAt, "PP")}</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => openEdit(testimonial)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <div className="flex space-x-2">
              {/* Edit/Upload Media Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => openEditMedia(testimonial)}
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit Media</TooltipContent>
              </Tooltip>

              {/* Delete Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => openDelete(testimonial)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Delete Testimonial</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editModal.testimonial && (
        <UpdateTestimonialForm
          onOpen={editModal.open}
          testimonial={editModal.testimonial}
          onSuccess={handleEditSuccess}
          onCancel={closeEdit}
        />
      )}

      {/* Edit Media Modal */}
      {editMediaModal.testimonial && (
        <UpdateTestimonialMediaForm
          onOpen={editMediaModal.open}
          testimonial={editMediaModal.testimonial}
          onCancel={closeEditMedia}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={closeDelete}
        testimonial={deleteModal.testimonial!}
        onSuccess={() => {
          closeDelete();
        }}
      />
    </>
  );
};
