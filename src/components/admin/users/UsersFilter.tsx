"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import React from "react";
import { HiAdjustmentsVertical } from "react-icons/hi2";

const UsersFilter = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
      <div className="flex items-center w-full">
        <div className="flex items-center border-b py-2 w-full">
          <SearchIcon className="mx-2" />
          <Input
            className="!bg-transparent border-0 focus:!ring-0 !shadow-none"
            placeholder="Search by name..."
          />
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size={"icon"}
              asChild
              className="!p-1.5 cursor-pointer ml-2 rounded-sm"
            >
              <HiAdjustmentsVertical size={16} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* tabs */}
      <div className="w-full flex">
        <Tabs defaultValue="user" className="w-full border-b ">
          <TabsList className=" bg-transparent rounded-none py-0 !h-full">
            <TabsTrigger
              value="user"
              className="text-base py-2.5 px-8 h-full rounded-none !border-b-2 data-[state=active]:!text-red-500 data-[state=active]:!border-b-red-500 data-[state=active]:!border-b-2 data-[state=active]:!shadow-none data-[state=active]:!bg-transparent data-[state=active]:border-0"
            >
              Users <Badge className="ml-2 !rounded-xs px-0.5 py-0">92</Badge>
            </TabsTrigger>
            <TabsTrigger value="realtor" className="text-base py-2.5 px-8 h-full rounded-none !border-b-2 data-[state=active]:!text-red-500 data-[state=active]:!border-b-red-500 data-[state=active]:!border-b-2 data-[state=active]:!shadow-none data-[state=active]:!bg-transparent data-[state=active]:border-0">
              Realtors <Badge className="ml-2 !rounded-xs px-0.5 py-0">08</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default UsersFilter;
