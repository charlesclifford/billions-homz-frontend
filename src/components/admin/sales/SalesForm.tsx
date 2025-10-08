"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ISale } from "@/interfaces/sales.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import useRealtors from "@/hooks/useRealtors";
import useEstates from "@/hooks/useEstates";
import { createSale } from "@/lib/api/sales";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import {
  AlertTriangle,
  CalendarIcon,
  CheckCircle,
  ImagePlus,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import { InputWithAffix } from "@/components/shared/InputWithAffix";
import { NairaIcon } from "../properties/EstateForm";
import { formatCurrency, formatNumberWithCommas } from "@/utils/helpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import useProperties from "@/hooks/useProperties";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { AxiosError } from "axios";

const formSchema = z
  .object({
    assetType: z.enum(["estate", "property"]),
    estate: z.string().optional(),
    property: z.string().optional(),
    units: z.coerce.number().min(0, "Unit must be positive"),
    buyerName: z.string().min(1, "Buyer name is required"),
    buyerPhone: z.string().min(1, "Buyer contact is required"),
    buyerEmail: z.string().email().optional().or(z.literal("")),
    buyerAddress: z.string().optional(),
    amountPaid: z.coerce.number().min(0, "Amount paid must be positive"),
    paymentType: z.enum(["full", "installment"]),
    paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "other"]),
    realtor: z.string().optional(),
    notes: z.string().optional(),
    paymentProof: z.any().optional(),
    dateSold: z.date({
      required_error: "Date of purchase is required",
    }),
  })
  .refine(
    (data) => {
      // Validate that either estate or property is provided based on assetType
      if (data.assetType === "estate") {
        return !!data.estate;
      } else {
        return !!data.property;
      }
    },
    {
      message: "Asset selection is required",
      path: ["assetType"], // This will show the error on the assetType field
    }
  )
  .refine(
    (data) => {
      // Validate units based on asset type
      if (data.assetType === "property") {
        return data.units === 1;
      }
      return true;
    },
    {
      message: "Properties can only have 1 unit",
      path: ["units"],
    }
  );

export type SalesFormValues = z.infer<typeof formSchema>;

interface SalesFormProps {
  initialValues?: Partial<ISale>;
  children?: React.ReactNode;
}

const SalesForm = ({ children, initialValues }: SalesFormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isMobile = useIsMobile();
  const { realtors } = useRealtors({
    page: 1,
    limit: 20,
  });
  const { estates } = useEstates({
    page: 1,
    limit: 20,
  });
  const { properties } = useProperties({
    page: 1,
    limit: 20,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<SalesFormValues | null>(
    null
  );
  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      assetType: "estate",
      estate: "",
      property: "",
      units: undefined,
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      buyerAddress: "",
      amountPaid: undefined,
      paymentType: "full",
      paymentMethod: "cash",
      realtor: undefined,
      notes: "",
      dateSold: undefined,
    },
  });

  const selectedAssetType = form.watch("assetType");

  useEffect(() => {
    if (initialValues) {
      if (initialValues.paymentProof?.imageUrl) {
        setPreviewImage(initialValues.paymentProof.imageUrl);
      }
      if (initialValues.dateSold) {
        form.setValue("dateSold", new Date(initialValues.dateSold));
      }
    }
  }, [initialValues, form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    onDrop: (acceptedFiles, fileRejections) => {
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

      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: createSale,
    onSuccess: async (data) => {
      // toast.success(data?.message || "Sale created successfully");
      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: data?.message || "Sale created successfully",
      });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // toast.error("Failed to create sale");
      console.error("Create sale error:", error);
      setDialog({
        open: true,
        type: "error",
        title: "Error",
        message: error.message || "Failed to create sale",
      });
    },
  });

  const onSubmit = async (values: SalesFormValues) => {
    const isEditing = !!initialValues?._id;
    const hadOriginalImage = !!initialValues?.paymentProof?.imageUrl;
    const imageWasRemoved = isEditing && hadOriginalImage && !previewImage;
    const noNewImageProvided = !imageFile;

    if (
      (!isEditing && noNewImageProvided) ||
      (isEditing && imageWasRemoved && noNewImageProvided)
    ) {
      // toast.error("Proof of payment is required");
      return;
    }

    setPendingValues(values);
    setConfirmOpen(true);
  };

  const confirmSave = async () => {
    if (!pendingValues) return;

    const formData = new FormData();

    // Append all form values
    formData.append("assetType", pendingValues.assetType);
    if (pendingValues.assetType === "estate" && pendingValues.estate) {
      formData.append("estate", pendingValues.estate);
    } else if (
      pendingValues.assetType === "property" &&
      pendingValues.property
    ) {
      formData.append("property", pendingValues.property);
    }

    formData.append("units", String(pendingValues.units));
    formData.append("buyerName", pendingValues.buyerName);
    formData.append("buyerPhone", pendingValues.buyerPhone);
    if (pendingValues.buyerEmail)
      formData.append("buyerEmail", pendingValues.buyerEmail);
    if (pendingValues.buyerAddress)
      formData.append("buyerAddress", pendingValues.buyerAddress);

    formData.append("amountPaid", String(pendingValues.amountPaid));
    formData.append("paymentType", pendingValues.paymentType);
    formData.append("paymentMethod", pendingValues.paymentMethod);

    if (pendingValues.notes) formData.append("notes", pendingValues.notes);
    if (pendingValues.realtor && pendingValues.realtor.trim() !== "") {
      formData.append("realtor", pendingValues.realtor);
    }

    formData.append("dateSold", pendingValues.dateSold.toISOString());

    // Append file if exists
    if (imageFile) {
      formData.append("file", imageFile);
    }

    createMutation.mutate(formData);
    setConfirmOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    setOpen(isOpen);
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  // Helper function to get estate name by ID
  const getAssetName = (assetId: string, assetType: "estate" | "property") => {
    if (assetType === "estate") {
      const estate = estates.find((e) => e._id === assetId);
      return estate
        ? `${estate.name} (${formatCurrency(estate.price as number)})`
        : assetId;
    } else {
      const property = properties.find((p) => p._id === assetId);
      return property
        ? `${property.title} (${formatCurrency(property.price as number)})`
        : assetId;
    }
  };

  // Helper function to get realtor name by ID
  const getRealtorName = (realtorId: string) => {
    const realtor = realtors.find((r) => r._id === realtorId);
    return realtor ? `${realtor.firstName} ${realtor.lastName}` : realtorId;
  };

  const renderFormContent = () => (
    <>
      <Form {...form}>
        <form
          id="sales-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-4 h-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Asset Type Selection */}
            <FormField
              control={form.control}
              name="assetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="estate">Estate</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateSold"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Purchase</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Asset Selection based on type */}
            {selectedAssetType === "estate" ? (
              <FormField
                control={form.control}
                name="estate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estate</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full cursor-pointer capitalize">
                          <SelectValue placeholder="Select estate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estates.map((estate) => (
                          <SelectItem
                            key={estate._id}
                            value={estate._id}
                            className={cn(
                              "capitalize cursor-pointer",
                              estate.soldUnits === estate.totalUnits &&
                                "line-through"
                            )}
                            disabled={estate.soldUnits === estate.totalUnits}
                          >
                            {estate.name} (
                            {formatCurrency(estate.price as number)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="property"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full cursor-pointer capitalize">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem
                            key={property._id}
                            value={property._id}
                            className={cn(
                              "capitalize cursor-pointer",
                              property.status !== "available" && "line-through"
                            )}
                            disabled={property.status !== "available"}
                          >
                            {property.title} (
                            {formatCurrency(property.price as number)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    Units {selectedAssetType === "property" && "(Always 1)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={selectedAssetType === "property" ? 1 : undefined}
                      placeholder="Units sold"
                      {...field}
                      // disabled={selectedAssetType === "property"}
                      value={field.value}
                      // value={selectedAssetType === "property" ? 1 : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Information */}
            <FormField
              control={form.control}
              name="buyerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buyerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buyerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="client@example.com"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buyerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyer Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Financial Information */}

            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <InputWithAffix
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter amount"
                      prefix={<NairaIcon />}
                      className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                      value={formatNumberWithCommas(field.value || 0)}
                      onChange={(e) => {
                        // Remove commas and non-numeric characters, then parse as number
                        const rawValue = e.target.value.replace(/[^\d]/g, "");
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

            {/* Payment Information */}
            {/* <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full">Full Payment</SelectItem>
                      <SelectItem value="installment">Installment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Realtor and Commission */}
            <FormField
              control={form.control}
              name="realtor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Realtor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer capitalize">
                        <SelectValue placeholder="Select realtor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {realtors.map((realtor) => (
                        <SelectItem
                          key={realtor._id}
                          value={realtor._id}
                          className="capitalize"
                        >
                          {realtor.firstName} {realtor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Proof */}
            <div className="md:col-span-2 space-y-2">
              <FormLabel>Proof of Payment</FormLabel>
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
                  className={`border-2 border-input border-dashed rounded-lg p-8 h-[200px] text-center cursor-pointer hover:border-primary transition-colors ${
                    isDragActive ? "border-primary bg-primary/10" : ""
                  } ${
                    form.formState.isSubmitted &&
                    ((!initialValues?._id && !imageFile) ||
                      (initialValues?._id &&
                        initialValues.paymentProof?.imageUrl &&
                        !previewImage &&
                        !imageFile))
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-2 h-full">
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
                      Proof of payment is required
                    </p>
                  )}
                  {initialValues?._id &&
                    initialValues.paymentProof?.imageUrl &&
                    !previewImage &&
                    !imageFile && (
                      <p className="text-sm font-medium text-destructive">
                        Please provide a new image or keep the existing one
                      </p>
                    )}
                </>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about the sale..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="!max-w-2xl max-h-[80vh]">
          <DialogHeader className="px-4">
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Sale Details
            </DialogTitle>
            <DialogDescription>
              Please review all information carefully. Sales records cannot be
              edited or deleted once created.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 h-[calc(80vh-240px)] px-4">
            <div className="space-y-4 py-4">
              {pendingValues && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Asset Type
                      </h4>
                      <p className="capitalize">{pendingValues.assetType}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Date of Purchase
                      </h4>
                      <p>{format(pendingValues.dateSold, "PPP")}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        {pendingValues.assetType === "estate"
                          ? "Estate"
                          : "Property"}
                      </h4>
                      <p className="capitalize">
                        {getAssetName(
                          pendingValues.assetType === "estate"
                            ? pendingValues.estate!
                            : pendingValues.property!,
                          pendingValues.assetType
                        )}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Units
                      </h4>
                      <p>{pendingValues.units}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground capitalize">
                        Buyer Name
                      </h4>
                      <p>{pendingValues.buyerName}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Buyer Contact
                      </h4>
                      <p>{pendingValues.buyerPhone}</p>
                    </div>

                    {pendingValues.buyerEmail && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          Buyer Email
                        </h4>
                        <p>{pendingValues.buyerEmail}</p>
                      </div>
                    )}

                    {pendingValues.buyerAddress && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          Buyer Address
                        </h4>
                        <p>{pendingValues.buyerAddress}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Amount Paid
                      </h4>
                      <p>{formatCurrency(pendingValues.amountPaid)}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Payment Type
                      </h4>
                      <p className="capitalize">{pendingValues.paymentType}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Payment Method
                      </h4>
                      <p className="capitalize">
                        {pendingValues.paymentMethod.replace("_", " ")}
                      </p>
                    </div>

                    {pendingValues.realtor && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          Realtor
                        </h4>
                        <p className="capitalize">
                          {getRealtorName(pendingValues.realtor)}
                        </p>
                      </div>
                    )}

                    {pendingValues.notes && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          Notes
                        </h4>
                        <p>{pendingValues.notes}</p>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Proof of Payment
                      </h4>
                      {previewImage && (
                        <div className="mt-2 aspect-video rounded-lg border">
                          <Image
                            src={previewImage}
                            alt="Payment proof preview"
                            className="w-full h-full object-contain"
                            width={400}
                            height={225}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-amber-800">
                          Important Notice
                        </h4>
                        <p className="text-amber-700 text-xs mt-1">
                          Sales records are permanent and cannot be edited or
                          deleted once created. Please ensure all information is
                          correct before confirming.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="px-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={createMutation.isPending}
              className="cursor-pointer"
            >
              Recheck
            </Button>
            <Button
              type="button"
              onClick={confirmSave}
              disabled={createMutation.isPending}
              className="cursor-pointer"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Sale...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  const renderFooter = () => (
    <>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleClose}
        disabled={createMutation.isPending}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        form="sales-form"
        className="cursor-pointer"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {"Saving..."}
          </>
        ) : (
          "Review and Confirm"
        )}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>{children}</SheetTrigger>
          <SheetContent
            className="w-full sm:max-w-lg"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <SheetHeader className="border-b">
              <SheetTitle className="text-xl">
                {initialValues?._id ? "Edit Sale" : "Record New Sale"}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 min-h-[calc(100dvh-180px)]">
              {renderFormContent()}
            </ScrollArea>
            <SheetFooter className="flex flex-row justify-end gap-2 pt-4">
              {renderFooter()}
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <FeedbackDialog
          open={dialog.open}
          type={dialog.type}
          title={dialog.title}
          message={dialog.message}
          onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
          actionLabel={dialog.type === "success" ? "Continue" : "Try Again"}
          onAction={() => {
            if (dialog.type === "success") {
              setDialog((prev) => ({ ...prev, open: false }));
            } else {
              setDialog((prev) => ({ ...prev, open: false }));
            }
          }}
          allowOutsideInteraction={false}
          hideCloseButton
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="!max-w-4xl w-full h-full lg:h-[calc(100vh-50px)]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {initialValues?._id ? "Edit Sale" : "Record New Sale"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details of the property sale
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {renderFormContent()}
          </ScrollArea>
          <DialogFooter>{renderFooter()}</DialogFooter>
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
            setDialog((prev) => ({ ...prev, open: false }));
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["allEstates"] });
            queryClient.invalidateQueries({ queryKey: ["allProperties"] });
            queryClient.invalidateQueries({ queryKey: ["salesAnalytics"] });
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

export default SalesForm;
