"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/useMobile";
import { IGallery } from "@/interfaces/photos.interface";
import { createPhoto, updatePhoto } from "@/lib/api/gallery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ImagePlus, Tag, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CATEGORIES = [
  { value: "property", label: "Property" },
  { value: "land", label: "Land" },
  { value: "event", label: "Event" },
  { value: "estate", label: "Estate" },
  { value: "other", label: "Other" },
];

const formSchema = z.object({
  caption: z.string().min(3, {
    message: "Caption must be at least 3 characters.",
  }),
  isFeatured: z.boolean(),
  tags: z.array(z.string()),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
});

export type PhotoFormValues = z.infer<typeof formSchema>;

interface FormProps {
  initialValues?: Partial<IGallery>;
  children?: React.ReactNode;
}

const PhotoUploader = ({ children, initialValues }: FormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isMobile = useIsMobile();

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      category: "",
      location: "",
      isFeatured: false,
      tags: [],
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...initialValues,
        tags: initialValues.tags || [],
        isFeatured: initialValues.isFeatured || false,
      });
      if (initialValues.imageUrl) {
        setPreviewImage(initialValues.imageUrl);
      }
    }
  }, [initialValues, form]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    },
  });

  const addPhotoMutation = useMutation({
    mutationFn: (data: FormData) => createPhoto(data),
    onSuccess: async (data) => {
      toast.success(data?.message || "Photo uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["allPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos-infinite"] });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating post:", error);
      toast.error(error?.message || "Failed to create post");
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: (data: PhotoFormValues) =>
      updatePhoto(initialValues?._id as string, data),
    onSuccess: async (data) => {
      toast.success(data?.message || "Photo updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["allPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos-infinite"] });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating post:", error);
      toast.error(error?.message || "Failed to update post");
    },
  });

  const onSubmit = async (values: PhotoFormValues) => {
    if (initialValues?._id) {
      // Update case - send as JSON
      const updateData = {
        ...values,
        tags: values.tags || [], // Ensure tags is always an array
      };
      updatePhotoMutation.mutate(updateData);
    } else {
      // Create case - send as FormData
      const formData = new FormData();
      formData.append("caption", values.caption);
      formData.append("category", values.category);
      formData.append("isFeatured", String(values.isFeatured));

      // Append tags as array
      values.tags.forEach((tag) => formData.append("tags[]", tag));

      if (values.location) formData.append("location", values.location);
      if (imageFile) {
        formData.append("file", imageFile);
      } else {
        toast.error("An image is required for new photos");
        return;
      }
      addPhotoMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    form.reset();
    setPreviewImage(null);
    setImageFile(null);
    setOpen(false);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag) {
        const currentTags = form.getValues("tags") || [];
        if (!currentTags.includes(newTag)) {
          form.setValue("tags", [...currentTags, newTag]);
        }
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    setOpen(isOpen);
  };

  const renderFormContent = () => (
    <Form {...form}>
      <form
        id="blog-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 h-full"
      >
        {/* Image Upload */}
        <div className="space-y-2">
          <FormLabel>Image</FormLabel>
          {previewImage ? (
            <div className="relative">
              <Image
                src={previewImage}
                alt="Preview"
                className="w-full aspect-video object-contain rounded-lg"
                width={800}
                height={450}
                priority
              />
              {(!initialValues?._id || !initialValues?.imageUrl) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="border-2 border-input border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-400">
                  JPEG, PNG, WEBP (Max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter post title"
                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Select */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Input */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter location"
                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Optional location where the photo was taken
              </p>
            </FormItem>
          )}
        />

        {/* Tags Input */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {field.value?.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tags (press Enter or comma)"
                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                  />
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Add relevant tags to help categorize your post
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured Photo</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Featured photos will be highlighted on the homepage
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  const renderFooter = () => (
    <>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="blog-form"
        className="cursor-pointer"
        disabled={addPhotoMutation.isPending || updatePhotoMutation.isPending}
      >
        {addPhotoMutation.isPending || updatePhotoMutation.isPending
          ? "Saving..."
          : initialValues?._id
          ? "Update"
          : "Upload"}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="border-b">
            <SheetTitle className="text-xl">
              {initialValues?._id ? "Update Photo" : "Upload Photo"}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-180px)]">
            {renderFormContent()}
          </ScrollArea>
          <SheetFooter className="flex flex-row justify-end gap-2 pt-4">
            {renderFooter()}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="w-full h-full lg:h-[calc(100vh-50px)]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialValues?._id ? "Update Photo" : "Upload Photo"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-[calc(100dvh-200px)]">
          {renderFormContent()}
        </ScrollArea>
        <DialogFooter>{renderFooter()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploader;
