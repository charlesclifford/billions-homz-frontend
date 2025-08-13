"use client";
import { InputWithAffix } from "@/components/shared/InputWithAffix";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Switch } from "@/components/ui/switch";
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
import { MapboxPicker } from "./MapboxPicker";

export const NairaIcon = () => <span className="font-medium">₦</span>;
export const SquareMetreIcon = () => (
  <span className="font-medium text-sm">sqm</span>
);

const formSchema = z.object({
  name: z.string().min(1, "Estate name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.object({
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().optional(),
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
  landmarks: z.array(z.string()).optional(),
  totalUnits: z.number().min(1, "Must have at least 1 plot"),
  plotSize: z.number().min(0, "Plot size cannot be negative").optional(),
  price: z.number().min(0, "Price cannot be negative"),
  allowInstallment: z.boolean().default(false).optional(),
  marketingNotes: z.string().optional(),
  estateType: z.string(),
});

export type EstateFormValues = z.infer<typeof formSchema>;

interface EstateFormProps {
  initialValues?: Partial<IEstate>;
}

const EstateForm = ({ initialValues }: EstateFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [featureInput, setFeatureInput] = useState("");
  const [landmarkInput, setLandmarkInput] = useState("");
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
        landmarks: initialValues?.location?.landmarks || [],
        coordinates: initialValues?.location?.coordinates || undefined,
      },
      features: initialValues?.features || [],
      documents: initialValues?.documents || [],
      totalUnits: initialValues?.totalUnits || undefined,
      plotSize: initialValues?.plotSize || undefined,
      price: initialValues?.price || undefined,
      allowInstallment: initialValues?.allowInstallment || false,
      marketingNotes: initialValues?.marketingNotes || "",
      estateType: initialValues?.estateType || "land",
    },
  });

  // Set initial image preview if editing
  useEffect(() => {
    if (initialValues) {
      if (initialValues.bannerImage?.imageUrl) {
        setPreviewImage(initialValues.bannerImage.imageUrl);
      }
    }
  }, [initialValues]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const handleAddLandmark = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newLandmark = landmarkInput.trim();
      if (newLandmark) {
        const currentLandmarks = form.getValues("location.landmarks") || [];
        if (!currentLandmarks.includes(newLandmark)) {
          form.setValue("location.landmarks", [
            ...currentLandmarks,
            newLandmark,
          ]);
        }
        setLandmarkInput("");
      }
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
    mutationFn: (data: FormData) => createEstate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allEstates"] });
      toast.success(data?.message || "Estate created successfully");
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
      queryClient.invalidateQueries({ queryKey: ["allEstates"] });
      toast.success(data?.message || "Estate updated successfully");
      router.push("/admin/estates");
    },
    onError: (error: Error) => {
      console.error("Error updating estate:", error);
      toast.error(error.message || "Failed to update estate");
    },
  });

  const onSubmit = (values: EstateFormValues) => {
    // Validate image for both create and edit cases
    const isEditing = !!initialValues?._id;
    const hadOriginalImage = !!initialValues?.bannerImage?.imageUrl;
    const imageWasRemoved = isEditing && hadOriginalImage && !previewImage;
    const noNewImageProvided = !imageFile;

    if (
      (!isEditing && noNewImageProvided) ||
      (isEditing && imageWasRemoved && noNewImageProvided)
    ) {
      toast.error("Banner image is required");
      return;
    }

    const formData = new FormData();

    // Append all form values
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("location[state]", values.location.state);
    formData.append("location[city]", values.location.city);
    formData.append("location[address]", values.location.address || "");
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
    formData.append("totalUnits", values.totalUnits.toString());
    formData.append("price", values.price.toString());

    if (values.plotSize) {
      formData.append("plotSize", values.plotSize.toString());
    }
    if (values.allowInstallment) {
      formData.append("allowInstallment", values.allowInstallment.toString());
    }
    if (values.marketingNotes) {
      formData.append("marketingNotes", values.marketingNotes);
    }
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
    formData.append("estateType", values.estateType);

    // Handle image upload
    if (imageFile) {
      formData.append("file", imageFile);
    } else if (!previewImage && initialValues?.bannerImage?.imageUrl) {
      // If image was removed
      formData.append("removeImage", "true");
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  const documentOptions = ["Registered Survey Plan", "Deed of Conveyance"];

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

                    <FormField
                      control={form.control}
                      name="marketingNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marketing Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Internal marketing notes..."
                              className="resize-none min-h-[100px] focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
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
                        name="totalUnits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Units</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Enter total units"
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
                        name="plotSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plot Size</FormLabel>
                            <FormControl>
                              <InputWithAffix
                                type="number"
                                min="0"
                                placeholder="Enter plot size"
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
                    <FormField
                      control={form.control}
                      name="allowInstallment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 py-2.5">
                          <div className="space-y-0.5">
                            <FormLabel>Allow Installment</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show installment payment badge
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
                                <Input
                                  value={landmarkInput}
                                  onChange={(e) =>
                                    setLandmarkInput(e.target.value)
                                  }
                                  onKeyDown={handleAddLandmark}
                                  placeholder="Add landmarks (press Enter or comma)"
                                  className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                />
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
                                      className="ml-1"
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
                                <SelectTrigger className="w-full">
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

                  {/* Images */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel>Banner Image</FormLabel>
                      {previewImage ? (
                        <div className="relative aspect-video rounded-lg border-2 border-input border-dashed">
                          <Image
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
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
                          className={`border-2 border-input border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors  ${
                            isDragActive ? "border-primary bg-primary/10" : ""
                          } ${
                            form.formState.isSubmitted &&
                            ((!initialValues?._id && !imageFile) ||
                              (initialValues?._id &&
                                initialValues.bannerImage?.imageUrl &&
                                !previewImage &&
                                !imageFile))
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center gap-2 aspect-video">
                            <ImagePlus className="h-8 w-8 text-gray-400" />
                            {isDragActive ? (
                              <p className="text-sm text-primary font-medium">
                                Drop the image here
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-gray-500">
                                  Drag & drop an image here, or click to select
                                </p>
                                <p className="text-xs text-gray-400">
                                  JPEG, PNG, WEBP (Max 5MB)
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {form.formState.isSubmitted && (
                        <>
                          {!initialValues?._id && !imageFile && (
                            <p className="text-sm font-medium text-destructive">
                              Banner image is required
                            </p>
                          )}
                          {initialValues?._id &&
                            initialValues.bannerImage?.imageUrl &&
                            !previewImage &&
                            !imageFile && (
                              <p className="text-sm font-medium text-destructive">
                                Please provide a new image or keep the existing
                                one
                              </p>
                            )}
                        </>
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
                    <Loader2 className=" h-4 w-4 animate-spin" />
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

export default EstateForm;
