"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IProperty } from "@/interfaces/property.interface";
import {
  GalleryPlugin,
  type GalleryPluginConfig,
} from "@photo-sphere-viewer/gallery-plugin";
import {
  MarkersPlugin,
  type MarkersPluginConfig,
} from "@photo-sphere-viewer/markers-plugin";
import {
  VirtualTourPlugin,
  type VirtualTourPluginConfig,
} from "@photo-sphere-viewer/virtual-tour-plugin";
import { Globe, ImagePlus, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import RoomCard from "./RoomCard";
import { RoomForm } from "./RoomForm";

import "@photo-sphere-viewer/gallery-plugin/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

// ✅ Plugin tuple types
type VirtualTourTuple = [typeof VirtualTourPlugin, VirtualTourPluginConfig];
type MarkersTuple = [typeof MarkersPlugin, MarkersPluginConfig];
type GalleryTuple = [typeof GalleryPlugin, GalleryPluginConfig];

// helper: generate fake gps near a base coordinate
const generateFakeGps = (index: number): [number, number, number] => {
  const baseLon = -80.156; // arbitrary "property" base longitude
  const baseLat = 25.666; // arbitrary base latitude
  const lon = baseLon + index * 0.0002; // spread slightly east
  const lat = baseLat + index * 0.0001; // spread slightly north
  const alt = 3; // constant height
  return [lon, lat, alt];
};

const PropertyRooms = ({ property }: { property: IProperty }) => {
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [selectedPanorama, setSelectedPanorama] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string>("");
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  // 🟢 Virtual Tour config
  const virtualTourPlugin = useMemo<VirtualTourTuple | null>(() => {
    if (!property.rooms?.length) return null;
    return [
      VirtualTourPlugin,
      {
        positionMode: "gps",
        renderMode: "3d",
        nodes: property.rooms.map((room, i) => {
          const gps = generateFakeGps(i);

          return {
            id: room.name,
            panorama: room.imageUrl,
            name: room.name,
            caption: room.name,
            gps,
            links: property.rooms
              .filter((_, j) => j !== i)
              .map((r, j) => ({
                nodeId: r.name || `room-${j}`,
                gps: generateFakeGps(j),
              })),
          };
        }),
        markerStyle: {
          color: "#ff5a5f",
          hoverScale: 1.2,
        },
        transitionOptions: {
          speed: "10rpm",
          fadeDuration: 1000,
        },
        startNodeId: property.rooms[0]?.name,
      },
    ];
  }, [property.rooms]);

  // 🟢 Markers config
  const markersPlugin = useMemo<MarkersTuple>(() => {
    return [
      MarkersPlugin,
      {
        markers:
          property.rooms?.map((room, i) => ({
            id: `marker-${i}`,
            gps: generateFakeGps(i),
            image: "https://cdn-icons-png.flaticon.com/512/61/61112.png",
            width: 32,
            height: 32,
            tooltip: room.name,
          })) || [],
      },
    ];
  }, [property.rooms]);

  // 🟢 Gallery config
  const galleryPlugin = useMemo<GalleryTuple>(() => {
    return [
      GalleryPlugin,
      {
        items:
          property.rooms?.map((room) => ({
            id: room.name,
            panorama: room.imageUrl,
            name: room.name,
            thumbnail: room.imageUrl,
          })) || [],
      },
    ];
  }, [property.rooms]);

  // 🟢 Handlers
  const handlePanoramaClick = useCallback(
    (imageUrl: string, roomName: string) => {
      setSelectedPanorama(imageUrl);
      setSelectedRoomName(roomName);
      setShowVirtualTour(false);
    },
    []
  );

  const handleVirtualTourClick = useCallback(() => {
    setShowVirtualTour(true);
    if (property.rooms?.[0]?.imageUrl) {
      setSelectedPanorama(property.rooms[0].imageUrl);
      setSelectedRoomName(property.rooms[0].name);
    }
  }, [property.rooms]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewerReady = useCallback((instance: any) => {
    const mp = instance.getPlugin(MarkersPlugin);
    const vtp = instance.getPlugin(VirtualTourPlugin);

    if (mp) console.log("MarkersPlugin ready:", mp.getMarkers());
    if (vtp) console.log("VirtualTourPlugin ready:", vtp.getCurrentNode());
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Rooms</CardTitle>
          <div className="flex gap-2">
            {property.rooms?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleVirtualTourClick}
                aria-label="Start Virtual Tour"
                className="cursor-pointer"
              >
                <Globe className="h-4 w-4 mr-2" />
                Virtual Tour
              </Button>
            )}
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
          </div>
        </CardHeader>
        <CardContent>
          {property.rooms?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.rooms.map((room, i) => (
                <div key={i} className="relative group">
                  <RoomCard room={room} property={property} />
                  {room.imageUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 lg:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-background/80 hover:bg-background"
                      onClick={() =>
                        handlePanoramaClick(room.imageUrl, room.name)
                      }
                      aria-label={`View 360° panorama of ${room.name}`}
                    >
                      <Globe className="h-4 w-4" />
                      360° View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <ImagePlus className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                No rooms added yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panorama Viewer Modal */}
      {selectedPanorama && (
        <Dialog
          open={!!selectedPanorama}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPanorama(null);
              setSelectedRoomName("");
              setShowVirtualTour(false);
            }
          }}
        >
          <DialogContent className="!max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-4">
              <DialogTitle>
                {showVirtualTour
                  ? "Virtual Tour"
                  : `360° View: ${selectedRoomName}`}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 relative w-full">
              <ReactPhotoSphereViewer
                src={selectedPanorama}
                height="100%"
                width="100%"
                containerClass="w-full h-full"
                littlePlanet={false}
                caption={selectedRoomName}
                loadingImg="https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif"
                loadingTxt="Loading panorama..."
                onReady={handleViewerReady}
                navbar={[
                  "autorotate",
                  "zoom",
                  "move",
                  "download",
                  "fullscreen",
                  "gallery",
                  "caption",
                  ...(showVirtualTour ? ["virtual-tour"] : []),
                ]}
                plugins={[
                  ...(showVirtualTour && virtualTourPlugin
                    ? [virtualTourPlugin]
                    : []),
                  markersPlugin,
                  galleryPlugin,
                ]}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PropertyRooms;
