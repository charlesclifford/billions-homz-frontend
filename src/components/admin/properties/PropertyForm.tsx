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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useEstates from "@/hooks/useEstates";
import { IProperty } from "@/interfaces/property.interface";
import { createProperty, updateProperty } from "@/lib/api/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bath, BedDouble, ImagePlus, Loader2, Ruler, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { NairaIcon, SquareMetreIcon } from "./EstateForm";

// Define property schema with validation
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["residential", "commercial", "land"]),
  listingType: z.enum(["rent", "sale", "lease"]),
  price: z.number().min(0, "Price must be positive"),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  area: z.number().min(1, "Area must be at least 1 sq ft"),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string(),
  }),
  features: z.array(z.string()).optional(),
  estateId: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialValues?: Partial<IProperty>;
}

const PropertyForm = ({ initialValues }: PropertyFormProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const { estates, isPending: isEstatesLoading } = useEstates();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      type: initialValues?.type || undefined,
      listingType: initialValues?.listingType || undefined,
      price: initialValues?.price || undefined,
      bedrooms: initialValues?.bedrooms || undefined,
      bathrooms: initialValues?.bathrooms || undefined,
      area: initialValues?.area || undefined,
      location: {
        address: initialValues?.location?.address || "",
        city: initialValues?.location?.city || "",
        state: initialValues?.location?.state || "",
        country: initialValues?.location?.country || "Nigeria",
      },
      features: initialValues?.features || [],
      estateId: initialValues?.estateId?._id || undefined,
    },
  });

  // Handle file upload with react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 4 * 1024 * 1024, // 4MB
    multiple: true,
  });

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleRemoveFeature = (feature: string) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue(
      "features",
      currentFeatures.filter((f) => f !== feature)
    );
  };

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (data) => {
      toast.success(data?.message || "Property created successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      router.push("/admin/properties");
    },
    onError: (error: Error) => {
      console.error("Error creating property:", error);
      toast.error(error.message || "Failed to create property");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      updateProperty(initialValues?._id as string, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Property updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      router.push("/admin/properties");
    },
    onError: (error: Error) => {
      console.error("Error creating property:", error);
      toast.error(error.message || "Failed to create property");
    },
  });

  const onSubmit = (values: PropertyFormData) => {
    const formData = new FormData();

    // Append all form data
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("type", values.type);
    formData.append("listingType", values.listingType);
    formData.append("price", values.price.toString());
    formData.append("area", values.area.toString());
    if (values.bedrooms)
      formData.append("bedrooms", values.bedrooms.toString());
    if (values.bathrooms)
      formData.append("bathrooms", values.bathrooms.toString());
    formData.append("location[address]", values.location.address || "");
    formData.append("location[city]", values.location.city);
    formData.append("location[state]", values.location.state);
    formData.append("location[country]", values.location.country);

    // Append features
    if (values.features) {
      values.features.forEach((feature) => {
        formData.append("features[]", feature);
      });
    }

    // Append files
    files.forEach((file) => {
      formData.append("files", file);
    });

    if (values.estateId) {
      formData.append("estateId", values.estateId);
    }

    if (initialValues?._id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [files]);

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">
            {initialValues?._id ? "Update Property" : "Create New Property"}
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
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Beautiful family home"
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
                          <FormLabel>Description*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the property..."
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
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm w-full cursor-pointer">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {["residential", "commercial", "land"].map(
                                  (type) => (
                                    <SelectItem key={type} value={type}>
                                      {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="listingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Listing Type*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm w-full cursor-pointer">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {["rent", "sale", "lease"].map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estateId"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Estate (Optional)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || undefined}
                              disabled={isEstatesLoading}
                            >
                              <SelectTrigger className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm w-full cursor-pointer">
                                <SelectValue
                                  placeholder={
                                    isEstatesLoading
                                      ? "Loading estates..."
                                      : "Select estate"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {isEstatesLoading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading estates...
                                  </SelectItem>
                                ) : estates && estates?.length > 0 ? (
                                  estates.map((estate) => (
                                    <SelectItem
                                      key={estate._id}
                                      value={estate._id}
                                    >
                                      {estate.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>
                                    No estates available
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price*</FormLabel>
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
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <InputWithAffix
                                type="number"
                                min="0"
                                placeholder="0"
                                prefix={<BedDouble className="w-4 h-4" />}
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
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <InputWithAffix
                                type="number"
                                min="0"
                                placeholder="0"
                                prefix={<Bath className="w-4 h-4" />}
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
                            <FormLabel>Area (sq ft)*</FormLabel>
                            <FormControl>
                              <InputWithAffix
                                type="number"
                                min="0"
                                placeholder="Enter area"
                                prefix={<Ruler className="w-4 h-4" />}
                                suffix={<SquareMetreIcon />}
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm pr-10"
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
                    </div>
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
                        name="location.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main Street"
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
                            <FormLabel>City*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="New York"
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
                        name="location.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="NY"
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

                  {/* Features */}
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
                                  <span>{feature}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(feature)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <Input
                              placeholder="Add features (press Enter or comma)"
                              value={featureInput}
                              onChange={(e) => setFeatureInput(e.target.value)}
                              onKeyDown={handleAddFeature}
                              className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Images */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Property Images*</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative aspect-square group rounded-lg overflow-hidden border"
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer transition-colors ${
                          isDragActive
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                        } ${
                          createMutation.isPending || updateMutation.isPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <input {...getInputProps()} />
                        {createMutation.isPending ||
                        updateMutation.isPending ? (
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-center text-muted-foreground">
                              {isDragActive
                                ? "Drop files here"
                                : "Drag & drop or click"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload at least 1 image (JPEG, PNG up to 4MB)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/admin/properties")}
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
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PropertyForm;
