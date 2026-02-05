"use client";
import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    // Handle form submission here
  };

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-[30px]">
        <h3 className="leading-[1] tracking-[-1px] font-bold text-[36px] lg:text-[52px]">
          Leave a message
        </h3>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] lg:gap-[30px]"
          >
            {/* First Name Field */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First name"
                      className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name Field */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last name"
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
                <FormItem className="col-span-1 lg:col-span-2">
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

            {/* Message Field - Full width */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormControl>
                    <Textarea
                      placeholder="Your message"
                      className="focus-visible:ring-0 shadow-none px-[30px] py-[15px] bg-gray-100 rounded-[30px] text-base leading-[1.75] h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 lg:col-span-2">
              <div className="flex justify-start">
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
      </div>
    </motion.div>
  );
};

export default ContactForm;
