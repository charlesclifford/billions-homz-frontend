"use client";
import { IProperty } from "@/interfaces/property.interface";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, Plus } from "lucide-react";
import RoomCard from "./RoomCard";
import { RoomForm } from "./RoomForm";

const PropertyRooms = ({ property }: { property: IProperty }) => {
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Rooms</CardTitle>
        <Dialog
          open={isAddRoomDialogOpen}
          onOpenChange={setIsAddRoomDialogOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm
              propertyId={property._id}
              onClose={() => setIsAddRoomDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {property.rooms?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.rooms.map((room, i) => (
              <RoomCard key={i} room={room} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <ImagePlus className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No rooms added yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyRooms;
