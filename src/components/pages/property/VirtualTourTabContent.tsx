"use client";

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
import { useCallback, useMemo, useState } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

import "@photo-sphere-viewer/gallery-plugin/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

type VirtualTourTuple = [typeof VirtualTourPlugin, VirtualTourPluginConfig];
type MarkersTuple = [typeof MarkersPlugin, MarkersPluginConfig];
type GalleryTuple = [typeof GalleryPlugin, GalleryPluginConfig];

const generateFakeGps = (index: number): [number, number, number] => {
  const baseLon = -80.156;
  const baseLat = 25.666;
  return [baseLon + index * 0.0002, baseLat + index * 0.0001, 3];
};

const VirtualTourTabContent = ({ property }: { property: IProperty }) => {
  const [selectedRoom] = useState(property.rooms?.[0] || null);

  const virtualTourPlugin = useMemo<VirtualTourTuple | null>(() => {
    if (!property.rooms?.length) return null;
    return [
      VirtualTourPlugin,
      {
        positionMode: "gps",
        renderMode: "3d",
        nodes: property.rooms.map((room, i) => ({
          id: room.name,
          panorama: room.imageUrl,
          thumbnail: room.imageUrl,
          name: room.name,
          caption: room.name,
          gps: generateFakeGps(i),
          links: property.rooms
            .filter((_, j) => j !== i)
            .map((r, j) => ({
              nodeId: r.name || `room-${j}`,
              gps: generateFakeGps(j),
            })),
        })),
        markerStyle: { color: "#ff5a5f", hoverScale: 1.2 },
        transitionOptions: { speed: "10rpm", fadeDuration: 1000 },
        startNodeId: property.rooms[0]?.name,
      },
    ];
  }, [property.rooms]);

  const markersPlugin = useMemo<MarkersTuple>(
    () => [
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
    ],
    [property.rooms]
  );

  const galleryPlugin = useMemo<GalleryTuple>(
    () => [
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
    ],
    [property.rooms]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewerReady = useCallback((instance: any) => {
    console.log("Viewer ready", instance);
  }, []);

  return (
    <div>
      <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
        360° Virtual Tour
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Viewer takes ~65% width on large screens */}
        <div className="w-full lg:w-[65%] aspect-video rounded-[30px] overflow-hidden bg-black border">
          {selectedRoom ? (
            <ReactPhotoSphereViewer
              src={selectedRoom.imageUrl}
              height="100%"
              width="100%"
              containerClass="w-full h-full"
              littlePlanet={false}
              caption={selectedRoom.name}
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
                "virtual-tour",
              ]}
              plugins={[
                ...(virtualTourPlugin ? [virtualTourPlugin] : []),
                markersPlugin,
                galleryPlugin,
              ]}
            />
          ) : (
            <p className="text-white p-4">No panorama available</p>
          )}
        </div>

        {/* Optional sidebar / placeholder (35% width) */}
        <div className="hidden lg:block lg:w-[35%]"></div>
      </div>
    </div>
  );
};

export default VirtualTourTabContent;
