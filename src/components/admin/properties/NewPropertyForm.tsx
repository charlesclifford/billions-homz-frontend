"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createProperty } from "@/lib/api/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bath,
  BedDouble,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Ruler,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
  }),
  estateId: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

const NewPropertyForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { estates, isPending: isEstatesLoading } = useEstates();

  console.log("estates>>", estates);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      type: "residential",
      listingType: "sale",
      price: 0,
      bedrooms: undefined,
      bathrooms: undefined,
      area: 0,
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
      },
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

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  };

  const createMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      setIsUploading(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Append all form data
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("listingType", data.listingType);
      formData.append("price", data.price.toString());
      formData.append("area", data.area.toString());
      if (data.bedrooms) formData.append("bedrooms", data.bedrooms.toString());
      if (data.bathrooms)
        formData.append("bathrooms", data.bathrooms.toString());
      formData.append("location[address]", data.location.address);
      formData.append("location[city]", data.location.city);
      formData.append("location[state]", data.location.state);
      formData.append("location[country]", data.location.country);

      // Append features
      features.forEach((feature) => {
        formData.append("features[]", feature);
      });

      // Append files
      files.forEach((file) => {
        formData.append("images", file);
      });

      if (data.estateId) {
        formData.append("estateId", data.estateId);
      }

      return createProperty(formData);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Property created successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      router.push("/dashboard/properties");
    },
    onError: (error: Error) => {
      console.error("Error creating property:", error);
      toast.error(error.message || "Failed to create property");
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const onSubmit = (values: PropertyFormData) => {
    createMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Beautiful family home in quiet neighborhood"
                          {...field}
                          className="bg-background"
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
                          placeholder="Describe the property features, amenities, and unique selling points..."
                          rows={6}
                          {...field}
                          className="bg-background min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Property Details Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  <span>Property Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
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
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["residential", "commercial", "land"].map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["rent", "sale", "lease"].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
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
                      <FormItem>
                        <FormLabel>Estate (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={isEstatesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue
                                placeholder={
                                  isEstatesLoading
                                    ? "Loading estates..."
                                    : "Select estate"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isEstatesLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading estates...
                              </SelectItem>
                            ) : estates && estates.length > 0 ? (
                              <>
                                {estates.map((estate) => (
                                  <SelectItem
                                    key={estate._id}
                                    value={estate._id}
                                  >
                                    {estate.name}
                                  </SelectItem>
                                ))}
                              </>
                            ) : (
                              <SelectItem value="no-estates" disabled>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price*</FormLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value || "0"))
                            }
                            className="bg-background pl-8"
                          />
                        </div>
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
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            <BedDouble className="w-4 h-4" />
                          </span>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value)
                              )
                            }
                            className="bg-background pl-8"
                          />
                        </div>
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
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            <Bath className="w-4 h-4" />
                          </span>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value)
                              )
                            }
                            className="bg-background pl-8"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sq ft)*</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <Ruler className="w-4 h-4" />
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value || "0"))
                          }
                          className="bg-background pl-8"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Location Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="location.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            {...field}
                            className="bg-background"
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
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Features Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add feature (e.g. Swimming Pool)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="bg-background"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddFeature}
                  >
                    Add
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="flex items-center gap-1 py-1 pl-2 pr-1 rounded-full"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="text-muted-foreground hover:text-foreground rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <CardTitle>Property Images*</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="rounded-lg w-full h-full object-cover border"
                        width={300}
                        height={300}
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
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/properties")}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createMutation.isPending || isUploading || files.length === 0
            }
            className="min-w-[150px]"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Property"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPropertyForm;
