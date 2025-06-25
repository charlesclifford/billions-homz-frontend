"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters." }),
  inquiry: z.string().min(1, { message: "Please select an inquiry type" }),
});

export type FormValues = z.infer<typeof formSchema>;

const QuickContactForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiry: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    // Handle form submission here
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] lg:gap-[30px]"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Inquiry Select Field */}
        <FormField
          control={form.control}
          name="inquiry"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] w-full !h-12">
                    <SelectValue placeholder="Select an inquiry type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Support Request</SelectItem>
                  <SelectItem value="sales">Sales Question</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-[15px] lg:gap-[30px]">
          <p className="text-neutral-500">
            <span>
              We&apos;re excited to connect with you! Required fields are marked
              *
            </span>
          </p>
          <div className="flex lg:justify-end">
            <button
              type="submit"
              className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group h-full cursor-pointer dark:bg-white"
            >
              <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
                <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
                  <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                    {/* Top icon – animates out along 45deg */}
                    <span className="flex absolute items-center justify-center  transition-all duration-500 transform-3d transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] opacity-100 group-hover:transform-[translate3d(17px,-17px,0px)_scale3d(0.2,0.2,1)] group-hover:opacity-0">
                      <ArrowUpRight />
                    </span>

                    {/* Bottom icon – animates in along 45deg */}
                    <span className="flex absolute items-center justify-center  transition-all duration-500 transform-[translate3d(-17px,17px,0px)_scale3d(0.2,0.2,1)_rotate(-45deg)] opacity-0 group-hover:transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] group-hover:opacity-100">
                      <ArrowUpRight />
                    </span>
                  </span>
                </span>
                <span className="inline-block text-black">Submit</span>
              </span>
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default QuickContactForm;
