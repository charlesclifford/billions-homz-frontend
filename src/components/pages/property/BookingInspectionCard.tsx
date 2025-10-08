"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import BookInspectionForm from "./BookInspectionForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingInspectionCardProps {
  property: {
    name: string;
  };
}

const BookingInspectionCard = ({ property }: BookingInspectionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-8 rounded-[30px] border bg-white dark:bg-gray-800 flex flex-col items-start gap-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">Book for an Inspection</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Schedule a convenient time to inspect this property.
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size={"lg"} className="w-full rounded-[30px] cursor-pointer">
            Book Inspection
          </Button>
        </DialogTrigger>

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
            <BookInspectionForm
              selectedEstate={property.name}
              onSuccess={handleSuccess}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingInspectionCard;
