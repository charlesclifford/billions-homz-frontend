"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

const locations = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
  "Enugu",
  "Abeokuta",
  "Warri",
  "Calabar",
  "Uyo",
  "Asaba",
  "Owerri",
  "Jos",
  "Kaduna",
];

const LocationComboBox = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-[30px] py-[15px] px-[30px] h-14 bg-gray-100 focus-visible:ring-0 cursor-pointer font-normal shadow-none",
            !value && "text-muted-foreground"
          )}
        >
          {value || "Select location"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0 rounded-2xl">
        <Command>
          <CommandInput placeholder="Type to search locations..." />
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location}
                  value={location}
                  onSelect={() => {
                    onChange(location);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationComboBox;
