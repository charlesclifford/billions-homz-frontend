"use client";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { testimonialKeys } from "@/hooks/useTestimonials";
import {
  ITestimonial,
  UpdateTestimonialData,
} from "@/interfaces/testimonial.interface";
import { updateTestimonial } from "@/lib/api/testimonials";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const testimonialFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position is too long"),
  company: z.string().max(100, "Company name is too long").optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content is too long"),
  isFeatured: z.boolean().default(false).optional(),
  isActive: z.boolean().default(true).optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

interface UpdateTestimonialFormProps {
  onOpen: boolean;
  testimonial: ITestimonial;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UpdateTestimonialForm = ({
  testimonial,
  onSuccess,
  onCancel,
  onOpen,
}: UpdateTestimonialFormProps) => {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonialData }) =>
      updateTestimonial(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonialKeys.featured() });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(variables.id),
      });

      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: data.message || "Testimonial updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.log(error);
      setDialog({
        open: true,
        type: "error",
        title: "Error",
        message: error.message || "Failed to create testimonial.",
      });
    },
  });

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company || "",
      content: testimonial.content,
      isFeatured: testimonial.isFeatured,
      isActive: testimonial.isActive,
    },
  });

  const onSubmit = (data: TestimonialFormValues) => {
    updateMutation.mutate({
      id: testimonial?._id,
      data: data,
    });
  };

  return (
    <>
      <Dialog open={onOpen} onOpenChange={onCancel}>
        <DialogContent
          className="max-w-4xl h-full lg:h-[calc(100vh-50px)]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <Form {...form}>
              <form
                id="update-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position/Role *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter position or role"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter company name (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testimonial Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your testimonial experience..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Maximum 1000 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Testimonial</FormLabel>
                          <FormDescription>
                            Display prominently on the website
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Show this testimonial publicly
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </ScrollArea>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="update-form"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className=" h-4 w-4 animate-spin" />
              )}
              {updateMutation.isPending ? "Updating..." : "Update Testimonial"}
            </Button>
          </DialogFooter>
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
            onSuccess();
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
