"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import useEstates from "@/hooks/useEstates";
import { useMutation } from "@tanstack/react-query";
import { bookInspection } from "@/lib/api/inspections";
import { AxiosError } from "axios";
import { toast } from "sonner";

// Updated Schema with firstName and lastName
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(8, { message: "Phone number is too short" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  source: z.string().min(1, { message: "Select an option" }),
  realtor: z.string().optional(),
  day: z.string().min(1, { message: "Select a day" }),
  estate: z.string().min(1, { message: "Select an estate" }),
});

export type InspectionFormValues = z.infer<typeof formSchema>;

// Animation variants
const formItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const BookInspectionForm = ({
  onSuccess,
  selectedEstate,
}: {
  onSuccess: () => void;
  selectedEstate?: string;
}) => {
  const { estates } = useEstates({
    page: 1,
    limit: 10,
  });

  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      source: "",
      realtor: "",
      day: "",
      estate: selectedEstate || "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: bookInspection,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = (values: InspectionFormValues) => {
    bookingMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] lg:gap-[30px]"
      >
        {/* First Name */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="First name"
                    className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Last Name */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Phone */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Your phone number"
                    className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Email */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Source */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-sm leading-[1.75] w-full !h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="How did you hear about us?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Radio">Radio</SelectItem>
                    <SelectItem value="Realtor">Realtor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Realtor */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="realtor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Realtor's name"
                    className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Day */}
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-sm leading-[1.75] w-full !h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Favourable day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Estate */}
        <motion.div variants={formItemVariants} className="">
          <FormField
            control={form.control}
            name="estate"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!!selectedEstate}
                >
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-sm leading-[1.75] w-full !h-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20 capitalize truncate">
                      <SelectValue
                        placeholder={
                          selectedEstate
                            ? selectedEstate
                            : "Estate you are interested in?"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {estates.map((estate, idx) => (
                      <SelectItem
                        key={idx}
                        value={estate.name}
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
        </motion.div>

        {/* Submit */}
        <div className="lg:col-span-2 flex justify-center">
          <button
            type="submit"
            disabled={bookingMutation.isPending}
            className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group cursor-pointer dark:bg-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
              <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
                <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                  {bookingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {/* Top icon – animates out */}
                      <span className="absolute transition-all duration-500 transform opacity-100 group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:scale-50 group-hover:opacity-0">
                        <ArrowUpRight />
                      </span>
                      {/* Bottom icon – animates in */}
                      <span className="absolute transition-all duration-500 transform -translate-x-4 translate-y-4 scale-50 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                        <ArrowUpRight />
                      </span>
                    </>
                  )}
                </span>
              </span>
              <span className="inline-block text-black">
                {bookingMutation.isPending ? "Submitting..." : "Submit"}
              </span>
            </span>
          </button>
        </div>
      </form>
    </Form>
  );
};

export default BookInspectionForm;
