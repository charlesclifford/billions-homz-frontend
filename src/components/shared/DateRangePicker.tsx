"use client";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface DateRangePickerProps {
  placeholder?: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  className?: string;
}

const DateRangePicker = ({
  placeholder = "Select date range",
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const [internalDateRange, setInternalDateRange] = useState<
    DateRange | undefined
  >(dateRange);

  useEffect(() => {
    setInternalDateRange(dateRange);
  }, [dateRange]);

  const handleDateChange = (range: DateRange | undefined) => {
    let normalizedRange: DateRange | undefined = range;

    // If from and to are the same, treat it as "to = undefined"
    if (
      range?.from &&
      range?.to &&
      range.from.getTime() === range.to.getTime()
    ) {
      normalizedRange = { from: range.from, to: undefined };
    }

    setInternalDateRange(normalizedRange);

    if (onDateRangeChange) {
      onDateRangeChange(normalizedRange);
    }

    if (normalizedRange?.from && normalizedRange?.to) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !internalDateRange?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDateRange?.from ? (
            internalDateRange.to ? (
              <>
                {format(internalDateRange.from, "MMM dd, yyyy")} -{" "}
                {format(internalDateRange.to, "MMM dd, yyyy")}
              </>
            ) : (
              format(internalDateRange.from, "MMM dd, yyyy")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={internalDateRange?.from}
          selected={internalDateRange}
          onSelect={handleDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
