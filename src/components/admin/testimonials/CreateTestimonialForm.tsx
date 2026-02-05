"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { testimonialKeys } from "@/hooks/useTestimonials";
import { createTestimonial } from "@/lib/api/testimonials";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { File, ImageIcon, Loader2, Upload, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

const testimonialFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position is too long"),
  company: z.string().max(100, "Company name is too long").optional(),
  content: z.string().max(1000, "Content is too long").optional(),
  isFeatured: z.boolean().default(false).optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

const CreateTestimonialForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      position: "",
      company: "",
      content: "",
      isFeatured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      formData: FormData;
      onProgress?: (progress: number) => void;
    }) => {
      return createTestimonial(data.formData, data.onProgress);
    },
    onSuccess: () => {
      setUploadProgress(0);
      setIsUploading(false);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonialKeys.featured() });

      // Reset form
      form.reset();
      setMediaFile(null);
      setMediaPreview(null);

      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: "Your testimonial has been created successfully.",
      });
    },
    onError: (error: Error) => {
      console.log(error);
      setUploadProgress(0);
      setIsUploading(false);
      setDialog({
        open: true,
        type: "error",
        title: "Error",
        message: error.message || "Failed to create testimonial.",
      });
    },
  });

  const onSubmit = (data: TestimonialFormValues) => {
    if (!mediaFile) {
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    if (data.company) formData.append("company", data.company);
    if (data.content) formData.append("content", data.content);
    if (data.isFeatured !== undefined) {
      formData.append("isFeatured", data.isFeatured.toString());
    }
    if (mediaFile) formData.append("media", mediaFile);

    setIsUploading(true);
    setUploadProgress(0);

    createMutation.mutate({
      formData,
      onProgress: (progress) => {
        setUploadProgress(progress);
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setMediaFile(file);

        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      if (rejectedFiles.length > 0) {
        const errorCode = rejectedFiles[0].errors[0]?.code;
        const message =
          errorCode === "file-too-large"
            ? "File size must be less than 50MB"
            : "Invalid file type. Only JPEG, PNG, WebP, MP4, WebM, or MOV allowed";

        toast.error(message);
      }
    },
  });

  const removeFile = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setUploadProgress(0);
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
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">
            Create New Testimonial
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position/Role *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter position or role"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter company name (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your testimonial experience..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum 1000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Testimonial</FormLabel>
                          <FormDescription>
                            Featured testimonials will be displayed prominently
                            on the website
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormItem>
                    <FormLabel>Media File *</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!mediaFile ? (
                          <div
                            {...getRootProps()}
                            className={cn(
                              "border-2 border-input border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors",
                              isDragActive
                                ? "border-primary bg-primary/10"
                                : "",
                              form.formState.isSubmitted && !mediaFile
                                ? "border-red-500"
                                : ""
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
                                Supports: JPEG, PNG, WebP, MP4, WebM, MOV (Max:
                                50MB)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative rounded-lg border-2 border-input border-dashed p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {getFileIcon(mediaFile)}
                                  <div>
                                    <p className="font-medium text-sm">
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
                                {!isUploading && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={removeFile}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              {/* Upload Progress */}
                              {isUploading && (
                                <div className="mt-4 space-y-2 p-3 bg-muted rounded-lg">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                      Uploading {mediaFile?.name}
                                    </span>
                                    <span className="font-semibold">
                                      {uploadProgress}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={uploadProgress}
                                    className="h-2"
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                      {mediaFile &&
                                        formatFileSize(
                                          (uploadProgress / 100) *
                                            mediaFile.size
                                        )}
                                    </span>
                                    <span>
                                      {mediaFile &&
                                        formatFileSize(mediaFile.size)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {mediaPreview && !isUploading && (
                                <div className="mt-4">
                                  {mediaFile.type.startsWith("image/") ? (
                                    <Image
                                      src={mediaPreview}
                                      alt="Preview"
                                      className="rounded-md max-h-60 w-full h-full object-contain mx-auto"
                                      width={300}
                                      height={300}
                                    />
                                  ) : (
                                    <video
                                      controls
                                      src={mediaPreview}
                                      className="rounded-md max-h-60 mx-auto"
                                      controlsList="nodownload"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {form.formState.isSubmitted && !mediaFile && (
                      <p className="text-sm text-destructive">
                        Media file is required
                      </p>
                    )}
                    <FormDescription>
                      Upload an image or video (Max: 50MB, Supported: JPEG, PNG,
                      WebP, MP4, WebM, MOV)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.back()}
                disabled={createMutation.isPending || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || isUploading}
                className="cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading... ({uploadProgress}%)
                  </>
                ) : createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Testimonial"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <FeedbackDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        actionLabel={dialog.type === "success" ? "Continue" : "Try Again"}
        onAction={() => {
          if (dialog.type === "success") {
            router.push("/admin/testimonials");
          } else {
            setDialog((prev) => ({ ...prev, open: false }));
          }
        }}
        allowOutsideInteraction={false}
        hideCloseButton
      />
    </div>
  );
};

export default CreateTestimonialForm;
