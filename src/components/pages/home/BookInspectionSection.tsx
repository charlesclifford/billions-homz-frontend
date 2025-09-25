"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import BookInspectionForm from "../property/BookInspectionForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const BookInspectionSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-background relative overflow-hidden">
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-16 lg:py-28 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Book an Inspection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to explore your future home? Schedule a guided inspection with
            our team at your convenience.
          </p>
        </div>

        {/* Dialog Trigger */}
        <div className="flex justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="submit"
                className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group cursor-pointer dark:bg-white"
              >
                <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
                  <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
                    <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                      {/* Top icon – animates out */}
                      <span className="absolute transition-all duration-500 transform opacity-100 group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:scale-50 group-hover:opacity-0">
                        <ArrowUpRight />
                      </span>
                      {/* Bottom icon – animates in */}
                      <span className="absolute transition-all duration-500 transform -translate-x-4 translate-y-4 scale-50 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                        <ArrowUpRight />
                      </span>
                    </span>
                  </span>
                  <span className="inline-block text-black">Book Now</span>
                </span>
              </button>
            </DialogTrigger>

            {/* Dialog Content */}
            <DialogContent className="sm:max-w-[700px] overflow-y-auto rounded-[30px] py-8 px-0">
              <DialogHeader className="text-center px-4 md:px-8">
                <DialogTitle className="text-2xl font-bold">
                  Book Your Inspection
                </DialogTitle>
                <DialogDescription>
                  Fill in the form below and we’ll confirm your inspection slot.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(100vh-200px)] px-4 md:px-8 py-8">
                <BookInspectionForm />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default BookInspectionSection;
