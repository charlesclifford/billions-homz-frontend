// components/admin/properties/AddRoomForm.tsx
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
import { addRoom } from "@/lib/api/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Note: File validation will be handled separately
});

export function AddRoomForm({ propertyId }: { propertyId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
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
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Error adding room:", error);
      toast.error(error.message || "Failed to add room");
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
    formData.append("name", values.name);
    formData.append("roomImage", file);
    formData.append("propertyId", propertyId);

    addMutation.mutate(formData);
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
                <Input placeholder="Master Bedroom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Room Image</FormLabel>
          {preview ? (
            <div className="relative aspect-square rounded-lg overflow-hidden border">
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
              className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer p-4"
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

        <Button type="submit" className="w-full">
          Add Room
        </Button>
      </form>
    </Form>
  );
}
