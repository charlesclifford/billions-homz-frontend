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
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { InputWithAffix } from "@/components/shared/InputWithAffix";
import { NairaIcon } from "../properties/EstateForm";

const formSchema = z.object({
  estate: z.string().min(1, "Estate is required"),
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
});

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

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      estate: "",
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
    },
  });

  useEffect(() => {
    if (initialValues) {
      if (initialValues.paymentProof?.imageUrl) {
        setPreviewImage(initialValues.paymentProof.imageUrl);
      }
    }
  }, [initialValues, form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const createMutation = useMutation({
    mutationFn: createSale,
    onSuccess: async (data) => {
      toast.success(data?.message || "Sale created successfully");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["allEstates"] });
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to create sale");
      console.error("Create sale error:", error);
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

    const formData = new FormData();

    // Append all form values
    formData.append("estate", values.estate);
    formData.append("units", String(values.units));
    formData.append("buyerName", values.buyerName);
    formData.append("buyerPhone", values.buyerPhone);
    if (values.buyerEmail) formData.append("buyerEmail", values.buyerEmail);
    if (values.buyerAddress)
      formData.append("buyerAddress", values.buyerAddress);

    formData.append("amountPaid", String(values.amountPaid));
    formData.append("paymentType", values.paymentType);
    formData.append("paymentMethod", values.paymentMethod);

    if (values.notes) formData.append("notes", values.notes);
    if (values.realtor && values.realtor.trim() !== "") {
      formData.append("realtor", values.realtor);
    }

    // Append file if exists
    if (imageFile) {
      formData.append("file", imageFile);
    }

    createMutation.mutate(formData);
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

  const renderFormContent = () => (
    <Form {...form}>
      <form
        id="sales-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 h-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estate and Unit */}
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
                        className="capitalize"
                      >
                        {estate.name}
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
            name="units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Units</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Units sold"
                    {...field}
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
                    type="number"
                    min={1}
                    placeholder="Enter amount"
                    prefix={<NairaIcon />}
                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Information */}
          <FormField
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
          />

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
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
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
          "Save"
        )}
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
              {initialValues?._id ? "Edit Sale" : "Record New Sale"}
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
        className="!max-w-4xl w-full h-full lg:h-[calc(100vh-50px)]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {" "}
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
  );
};

export default SalesForm;
