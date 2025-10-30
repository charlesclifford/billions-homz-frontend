"use client";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { testimonialKeys } from "@/hooks/useTestimonials";
import { ITestimonial } from "@/interfaces/testimonial.interface";
import { updateTestimonialMedia } from "@/lib/api/testimonials";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { File, ImageIcon, Loader2, Upload, Video, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdateTestimonialMediaFormProps {
  testimonial: ITestimonial;
  onCancel: () => void;
  onOpen: boolean;
}

export const UpdateTestimonialMediaForm = ({
  testimonial,
  onCancel,
  onOpen,
}: UpdateTestimonialMediaFormProps) => {
  const queryClient = useQueryClient();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const form = useForm<{ media: File | null }>({
    defaultValues: { media: null },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ id, mediaFile }: { id: string; mediaFile: File }) =>
      updateTestimonialMedia(id, mediaFile),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonialKeys.featured() });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(variables.id),
      });
      setMediaPreview(null);

      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: data.message,
      });
    },
    onError: (error: Error) => {
      console.log(error);
      setDialog({
        open: true,
        type: "error",
        title: "Error",
        message: error.message || "Failed to upload media.",
      });
    },
  });

  // ✅ dropzone handler
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setMediaFile(file);
        form.setValue("media", file);

        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      if (rejectedFiles.length > 0) {
        const errorCode = rejectedFiles[0].errors[0]?.code;
        const message =
          errorCode === "file-too-large"
            ? "File size must be less than 50MB"
            : "Invalid file type. Only JPEG, PNG, WebP, MP4, or WebM allowed";
        toast.error(message);
      }
    },
  });

  const removeFile = () => {
    setMediaFile(null);
    setMediaPreview(null);
    form.reset();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    } else if (file.type.startsWith("video/")) {
      return <Video className="h-8 w-8 text-purple-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit = (data: { media: File | null }) => {
    if (!data.media) {
      toast.error("Please select a media file first.");
      return;
    }

    updateMediaMutation.mutate({
      id: testimonial._id,
      mediaFile: data.media,
    });
  };

  return (
    <>
      <Dialog open={onOpen} onOpenChange={onCancel}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Testimonial Media</DialogTitle>
            <DialogDescription>
              Replace the current media file with a new image or video.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Media Preview */}
              <div>
                <FormLabel>Current Media</FormLabel>
                <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-sidebar">
                  <div className="flex items-center space-x-3">
                    {testimonial.media?.type === "video" ? (
                      <Video className="h-8 w-8 text-purple-500" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {testimonial.media?.type === "video"
                          ? "Video"
                          : "Image"}{" "}
                        File
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.media?.format?.toUpperCase()} •{" "}
                        {testimonial.media?.size &&
                          formatFileSize(testimonial.media.size)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Media Upload */}
              <FormField
                control={form.control}
                name="media"
                render={() => (
                  <FormItem>
                    <FormLabel>New Media File *</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!mediaFile ? (
                          <div
                            {...getRootProps()}
                            className={cn(
                              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                              isDragActive ? "border-primary bg-primary/10" : ""
                            )}
                          >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center gap-2 aspect-video">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-4">
                                <p className="text-lg font-medium text-gray-500">
                                  {isDragActive
                                    ? "Drop the file here"
                                    : "Drag & drop a file here"}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                  or click to select a file
                                </p>
                              </div>
                              <p className="mt-2 text-xs text-gray-400">
                                Supports: JPEG, PNG, WebP, MP4, WebM (Max: 50MB)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-sidebar">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getFileIcon(mediaFile)}
                                <div>
                                  <p className="font-medium text-sm text-ellipsis overflow-hidden max-w-xs">
                                    {mediaFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(mediaFile.size)} •{" "}
                                    {mediaFile.type.startsWith("image/")
                                      ? "Image"
                                      : "Video"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={removeFile}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            {mediaPreview &&
                              (mediaFile.type.startsWith("image/") ? (
                                <Image
                                  src={mediaPreview}
                                  alt="Preview"
                                  className="mt-4 rounded-md max-h-60 w-full h-full object-contain mx-auto"
                                  width={300}
                                  height={300}
                                />
                              ) : (
                                <video
                                  controls
                                  src={mediaPreview}
                                  className="mt-4 rounded-md max-h-60 mx-auto"
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a new image or video to replace the current media
                      (Max: 50MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={updateMediaMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMediaMutation.isPending || !mediaFile}
                >
                  {updateMediaMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {updateMediaMutation.isPending
                    ? "Updating..."
                    : "Update Media"}
                </Button>
              </div>
            </form>
          </Form>
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
            onCancel();
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
