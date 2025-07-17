"use client";
import { InputWithAffix } from "@/components/shared/InputWithAffix";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IEstate } from "@/interfaces/estate.interface";
import { createEstate, updateEstate } from "@/lib/api/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag } from "iconsax-reactjs";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const NairaIcon = () => <span className="font-medium">₦</span>;
export const SquareMetreIcon = () => <span className="font-medium text-sm">sqm</span>;

const formSchema = z.object({
  name: z.string().min(1, "Estate name is required"),
  description: z.string().optional(),
  location: z.object({
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().optional(),
    country: z.string(),
    landmark: z.string().optional(),
  }),
  features: z.array(z.string()).optional(),
  bannerImage: z.string().optional(),
  totalPlots: z.number().min(1, "Must have at least 1 plot"),
  area: z.number().min(0, "Area cannot be negative").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
});

export type EstateFormValues = z.infer<typeof formSchema>;

interface EstateFormProps {
  initialValues?: Partial<IEstate>;
}

const EstateForm = ({ initialValues }: EstateFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [featureInput, setFeatureInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<EstateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      location: {
        address: initialValues?.location?.address || "",
        city: initialValues?.location?.city || "",
        state: initialValues?.location?.state || "",
        country: initialValues?.location?.country || "Nigeria",
        landmark: initialValues?.location?.landmark || "",
      },
      features: initialValues?.features || [],
      totalPlots: initialValues?.totalPlots || undefined,
      area: initialValues?.area || undefined,
      price: initialValues?.price || undefined,
      bannerImage: initialValues?.bannerImage?.imageUrl || "",
    },
  });

  // Set initial image preview if editing
  useEffect(() => {
    if (initialValues?.bannerImage?.imageUrl) {
      setPreviewImage(initialValues.bannerImage.imageUrl);
    }
  }, [initialValues]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    },
  });

  const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newFeature = featureInput.trim();
      if (newFeature) {
        const currentFeatures = form.getValues("features") || [];
        if (!currentFeatures.includes(newFeature)) {
          form.setValue("features", [...currentFeatures, newFeature]);
        }
        setFeatureInput("");
      }
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue(
      "features",
      currentFeatures.filter((f) => f !== featureToRemove)
    );
  };

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createEstate(data),
    onSuccess: (data) => {
      toast.success(data?.message || "Estate created successfully");
      queryClient.invalidateQueries({ queryKey: ["allEstates"] });
      router.push("/admin/estates");
    },
    onError: (error: Error) => {
      console.error("Error creating estate:", error);
      toast.error(error.message || "Failed to create estate");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      updateEstate(initialValues?._id as string, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Estate updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allEstates"] });
      router.push("/admin/estates");
    },
    onError: (error: Error) => {
      console.error("Error updating estate:", error);
      toast.error(error.message || "Failed to update estate");
    },
  });

  const onSubmit = (values: EstateFormValues) => {
    const formData = new FormData();

    // Append all form values
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("location[state]", values.location.state);
    formData.append("location[city]", values.location.city);
    formData.append("location[address]", values.location.address || "");
    formData.append("location[country]", values.location.country);
    formData.append("location[landmark]", values.location.landmark || "");
    formData.append("totalPlots", values.totalPlots.toString());

    if (values.area) formData.append("area", values.area.toString());
    if (values.price) formData.append("price", values.price.toString());

    if (values.features) {
      values.features.forEach((feature) => {
        formData.append("features[]", feature);
      });
    }

    // Handle image upload
    if (imageFile) {
      formData.append("file", imageFile);
    } else if (!previewImage && initialValues?.bannerImage?.imageUrl) {
      // If image was removed
      formData.append("removeImage", "true");
    }

    if (initialValues?._id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    form.setValue("bannerImage", "");
  };

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">
            {initialValues?._id ? "Update Estate" : "Create New Estate"}
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-6">
              {/* Main 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Basic Information</h2>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estate Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter estate name"
                              className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the estate..."
                              className="resize-none min-h-[120px] focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Property Details */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Property Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="totalPlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Plots</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Enter total plots"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area</FormLabel>
                            <FormControl>
                              <InputWithAffix
                                type="number"
                                min="0"
                                placeholder="Enter area"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm pr-10"
                                suffix={<SquareMetreIcon />}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <InputWithAffix
                                  type="number"
                                  min="0"
                                  placeholder="Enter price"
                                  prefix={<NairaIcon />}
                                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Features & Amenities
                    </h2>

                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Features</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                {field.value?.map((feature) => (
                                  <div
                                    key={feature}
                                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    <Tag className="h-3 w-3" />
                                    <span>{feature}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveFeature(feature)
                                      }
                                      className="text-gray-500 hover:text-red-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <Input
                                value={featureInput}
                                onChange={(e) =>
                                  setFeatureInput(e.target.value)
                                }
                                onKeyDown={handleAddFeature}
                                placeholder="Add features (press Enter or comma)"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Location Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Location Information
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="location.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter state"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter city"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter address"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location.landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nearby Landmark</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter landmark"
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel>Banner Image</FormLabel>
                      {previewImage ? (
                        <div className="relative aspect-video rounded-lg border-2 border-input border-dashed ">
                          <Image
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain "
                            width={800}
                            height={450}
                            priority
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className="border-2 border-input border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors "
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center gap-2 aspect-video">
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
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin/estates")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialValues?._id ? "Updating..." : "Creating..."}
                  </>
                ) : initialValues?._id ? (
                  "Update Estate"
                ) : (
                  "Create Estate"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EstateForm;
