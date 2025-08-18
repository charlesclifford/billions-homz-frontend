"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IRoom } from "@/interfaces/property.interface";
import { addRoom, updateRoom } from "@/lib/api/properties";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Note: File validation will be handled separately
});

export function RoomForm({
  propertyId,
  onClose,
  initialValues,
}: {
  propertyId: string;
  onClose: () => void;
  initialValues?: IRoom;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      if (initialValues.imageUrl) {
        setPreview(initialValues.imageUrl);
      }
    }
  }, [initialValues, form]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 4 * 1024 * 1024, // 4MB
    maxFiles: 1,
  });

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    if (preview) URL.revokeObjectURL(preview);
  };

  const addMutation = useMutation({
    mutationFn: (data: FormData) => addRoom(propertyId, data),
    onSuccess: (data) => {
      toast.success(data?.message);
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Error adding room:", error);
      toast.error(error.message || "Failed to add room");
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: (data: FormData) => updateRoom(propertyId, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      onClose();
      router.refresh();
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update room");
    },
  });

  const onSubmit = (values: z.infer<typeof roomSchema>) => {
    if (!file) {
      form.setError("root", {
        type: "manual",
        message: "Please upload an image for the room",
      });
      return;
    }

    const formData = new FormData();
    formData.append("roomName", values.name);
    formData.append("roomImage", file);
    formData.append("propertyId", propertyId);

    if (initialValues) {
      updateRoomMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Master Bedroom"
                  {...field}
                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                  disabled={Boolean(initialValues)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Room Image</FormLabel>
          {preview ? (
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Room preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg flex flex-col items-center justify-center aspect-video cursor-pointer p-4",
                isDragActive ? "border-primary bg-primary/10" : "",
                form.formState.errors.root && "border-destructive"
              )}
            >
              <input {...getInputProps()} />
              <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-center text-muted-foreground">
                Drag & drop an image, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (Max 4MB, JPEG/PNG/WEBP)
              </p>
            </div>
          )}
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={addMutation.isPending || updateRoomMutation.isPending}
        >
          {addMutation.isPending || updateRoomMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : initialValues ? (
            "Update Image"
          ) : (
            "Add Room"
          )}
        </Button>
      </form>
    </Form>
  );
}
