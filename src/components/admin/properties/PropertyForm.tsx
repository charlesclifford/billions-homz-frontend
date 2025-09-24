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
import { IProperty } from "@/interfaces/property.interface";
import { createProperty, updateProperty } from "@/lib/api/properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bath,
  BedDouble,
  ImagePlus,
  Loader2,
  Plus,
  Ruler,
  Tag,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { NairaIcon, SquareMetreIcon } from "./EstateForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { MapboxPicker } from "./MapboxPicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatNumberWithCommas } from "@/utils/helpers";
import { nigeriaStates } from "@/data/nigeria-states";

// Define property schema with validation
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["residential", "commercial"]),
  listingType: z.enum(["rent", "sale", "lease"]),
  price: z.number().min(0, "Price must be positive"),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  dimensions: z.number().min(1, "Area must be at least 1 sq ft"),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string(),
    landmarks: z.array(z.string()).optional(),
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional(),
  }),
  features: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  virtualTour: z.boolean().default(false).optional(),
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
  const [landmarkInput, setLandmarkInput] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>(
    initialValues?.location?.state || ""
  );

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
      dimensions: initialValues?.dimensions || undefined,
      location: {
        address: initialValues?.location?.address || "",
        city: initialValues?.location?.city || "",
        state: initialValues?.location?.state || "",
        country: initialValues?.location?.country || "Nigeria",
        landmarks: initialValues?.location?.landmarks || [],
        coordinates: initialValues?.location?.coordinates || undefined,
      },
      features: initialValues?.features || [],
      documents: initialValues?.documents || [],
      virtualTour: initialValues?.virtualTour || false,
    },
  });

  // Handle file upload with react-dropzone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    // Handle file rejections (too large, wrong type, etc.)
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 5MB.");
      } else {
        toast.error("Invalid file type. Please use JPEG, PNG, or WEBP.");
      }
      return;
    }

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

  const handleRemoveExistingImage = (publicId: string) => {
    setImagesToDelete((prev) => [...prev, publicId]);
  };

  const addFeature = () => {
    const newFeature = featureInput.trim();
    if (newFeature) {
      const currentFeatures = form.getValues("features") || [];
      if (!currentFeatures.includes(newFeature)) {
        form.setValue("features", [...currentFeatures, newFeature]);
      }
      setFeatureInput("");
    }
  };

  const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleRemoveFeature = (feature: string) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue(
      "features",
      currentFeatures.filter((f) => f !== feature)
    );
  };

  const addLandmark = () => {
    const newLandmark = landmarkInput.trim();
    if (newLandmark) {
      const currentLandmarks = form.getValues("location.landmarks") || [];
      if (!currentLandmarks.includes(newLandmark)) {
        form.setValue("location.landmarks", [...currentLandmarks, newLandmark]);
      }
      setLandmarkInput("");
    }
  };

  const handleAddLandmark = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addLandmark();
    }
  };

  const handleRemoveLandmark = (landmarkToRemove: string) => {
    const currentLandmarks = form.getValues("location.landmarks") || [];
    form.setValue(
      "location.landmarks",
      currentLandmarks.filter((l) => l !== landmarkToRemove)
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
    // Check if we have at least one image
    const hasExistingImages = initialValues?.images?.some(
      (img) => !imagesToDelete.includes(img.publicId)
    );
    const hasNewImages = files.length > 0;

    if (!hasExistingImages && !hasNewImages) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();

    // Append all form data
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("type", values.type);
    formData.append("listingType", values.listingType);
    formData.append("price", values.price.toString());
    formData.append("dimensions", values.dimensions.toString());
    if (values.bedrooms)
      formData.append("bedrooms", values.bedrooms.toString());
    if (values.bathrooms)
      formData.append("bathrooms", values.bathrooms.toString());
    formData.append("location[address]", values.location.address || "");
    formData.append("location[city]", values.location.city);
    formData.append("location[state]", values.location.state);
    formData.append("location[country]", values.location.country);
    if (values.location.landmarks) {
      values.location.landmarks.forEach((landmark) => {
        formData.append("location[landmarks][]", landmark);
      });
    }
    if (values.location.coordinates) {
      formData.append(
        "location[coordinates][lat]",
        values.location.coordinates.lat.toString()
      );
      formData.append(
        "location[coordinates][lng]",
        values.location.coordinates.lng.toString()
      );
    }

    // Append features
    if (values.features) {
      values.features.forEach((feature) => {
        formData.append("features[]", feature);
      });
    }

    if (values.documents) {
      values.documents.forEach((doc) => {
        formData.append("documents[]", doc);
      });
    }

    formData.append("virtualTour", values.virtualTour ? "true" : "false");

    // Append files
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Append images to delete
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
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

  const documentOptions = [
    "Registered Survey Plan",
    "Deed of Conveyance",
    "Certificate of Occupancy",
    "Power of Attorney",
    "Purchase Receipt",
  ];

  const handleDocumentSelect = (value: string) => {
    const currentDocuments = form.getValues("documents") || [];
    if (currentDocuments.includes(value)) {
      form.setValue(
        "documents",
        currentDocuments.filter((doc) => doc !== value)
      );
    } else {
      form.setValue("documents", [...currentDocuments, value]);
    }
  };

  const hasImages = useMemo(() => {
    const hasExisting = initialValues?.images?.some(
      (img) => !imagesToDelete.includes(img.publicId)
    );
    return hasExisting || files.length > 0;
  }, [initialValues?.images, imagesToDelete, files]);

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
                          <FormLabel>Property Title</FormLabel>
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
                          <FormLabel>Description</FormLabel>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm w-full cursor-pointer">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {["residential", "commercial"].map((type) => (
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
                        name="listingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Listing Type</FormLabel>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <InputWithAffix
                                type="text"
                                inputMode="numeric"
                                min="0"
                                placeholder="Enter price"
                                prefix={<NairaIcon />}
                                className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                value={formatNumberWithCommas(field.value || 0)}
                                onChange={(e) => {
                                  // Remove commas and non-numeric characters, then parse as number
                                  const rawValue = e.target.value.replace(
                                    /[^\d]/g,
                                    ""
                                  );
                                  const numericValue = rawValue
                                    ? parseInt(rawValue, 10)
                                    : 0;
                                  field.onChange(numericValue);
                                }}
                                onBlur={field.onBlur}
                                onFocus={(e) => {
                                  // Select all text on focus for easy editing
                                  e.target.select();
                                }}
                                ref={field.ref}
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
                        name="dimensions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area (sq ft)</FormLabel>
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

                    {/* Features */}
                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Features</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {field.value?.map((feature) => (
                                  <Badge
                                    key={feature}
                                    className="flex items-center gap-1"
                                  >
                                    <Tag className="h-3 w-3" />
                                    <span>{feature}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveFeature(feature)
                                      }
                                      className="ml-1 cursor-pointer"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={featureInput}
                                  onChange={(e) =>
                                    setFeatureInput(e.target.value)
                                  }
                                  onKeyDown={handleAddFeature}
                                  placeholder="Add features (press Enter or comma)"
                                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  onClick={addFeature}
                                  className="shrink-0 cursor-pointer"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedState(value);
                                  // reset city when state changes
                                  form.setValue("location.city", "");
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(nigeriaStates).map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!selectedState}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedState &&
                                    nigeriaStates[selectedState]?.map(
                                      (city) => (
                                        <SelectItem key={city} value={city}>
                                          {city}
                                        </SelectItem>
                                      )
                                    )}
                                </SelectContent>
                              </Select>
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
                        name="location.landmarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Landmarks</FormLabel>
                            <FormControl>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  {field.value?.map((landmark) => (
                                    <Badge
                                      key={landmark}
                                      className="flex items-center gap-1"
                                    >
                                      {landmark}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveLandmark(landmark)
                                        }
                                        className="ml-1 cursor-pointer"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    value={landmarkInput}
                                    onChange={(e) =>
                                      setLandmarkInput(e.target.value)
                                    }
                                    onKeyDown={handleAddLandmark}
                                    placeholder="Add landmarks (press Enter or comma)"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    onClick={addLandmark}
                                    className="shrink-0 cursor-pointer"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location.coordinates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pick Location</FormLabel>
                            <FormControl>
                              <MapboxPicker
                                lat={field.value?.lat}
                                lng={field.value?.lng}
                                onSelect={(coords) => field.onChange(coords)}
                                height={300}
                                className="mt-1"
                                zoom={12}
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
                  {/* Documents  */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      Required Documents
                    </h2>
                    <FormField
                      control={form.control}
                      name="documents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Documents (Optional)</FormLabel>
                          <FormControl>
                            <div>
                              <div className="flex flex-wrap gap-2 mb-1">
                                {field.value?.map((doc) => (
                                  <Badge
                                    key={doc}
                                    className="flex items-center gap-1"
                                  >
                                    {doc}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        form.setValue(
                                          "documents",
                                          field.value?.filter(
                                            (d) => d !== doc
                                          ) || []
                                        )
                                      }
                                      className="ml-1 cursor-pointer"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <Select
                                onValueChange={handleDocumentSelect}
                                value=""
                              >
                                <SelectTrigger className="w-full cursor-pointer">
                                  <SelectValue placeholder="Select documents..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {documentOptions.map((option) => (
                                    <SelectItem
                                      key={option}
                                      value={option}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={field.value?.includes(
                                            option
                                          )}
                                          className="h-4 w-4"
                                        />
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {option}
                                        </label>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Virtual Tour */}
                  <FormField
                    control={form.control}
                    name="virtualTour"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 py-2.5">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Virtual Tour</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Allows adding room-by-room virtual tours later
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Images */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Property Images</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Existing Images */}
                      {initialValues?.images?.map(
                        (image, index) =>
                          !imagesToDelete.includes(image.publicId) && (
                            <div
                              key={`existing-${index}`}
                              className="relative aspect-square group rounded-lg overflow-hidden border"
                            >
                              <Image
                                src={image.imageUrl}
                                alt={`Existing image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveExistingImage(image.publicId)
                                }
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                      )}

                      {/* new images */}
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
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer transition-colors ${
                          isDragActive ? "border-primary bg-primary/10" : ""
                        } ${
                          form.formState.isSubmitted && !hasImages
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <input {...getInputProps()} />
                        <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          {isDragActive
                            ? "Drop files here"
                            : "Drag & drop or click"}
                        </p>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-xs text-muted-foreground",
                        form.formState.isSubmitted &&
                          !hasImages &&
                          "text-destructive"
                      )}
                    >
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
                onClick={() => router.back()}
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
                    <Loader2 className="h-4 w-4 animate-spin" />
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
