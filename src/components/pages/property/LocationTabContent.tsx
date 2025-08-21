"use client";
import { MapViewer } from "@/components/shared/MapViewer";
import { IProperty } from "@/interfaces/property.interface";
import { config } from "@/utils/config";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

const { MAPBOX_ACCESS_TOKEN } = config;

const LocationTabContent = ({ property }: { property: IProperty }) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.warn("Geolocation error:", err)
      );
    }
  }, []);

  // Fetch route and add to map
  const getDirections = async () => {
    if (!userLocation || !property.location?.coordinates || !mapRef.current)
      return;

    const from = [userLocation.lng, userLocation.lat];
    const to = [
      property.location.coordinates.lng,
      property.location.coordinates.lat,
    ];

    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await res.json();
    const geometry = data.routes?.[0]?.geometry;
    if (!geometry) return;

    // Add or update route layer
    if (mapRef.current.getSource("route")) {
      (mapRef.current.getSource("route") as mapboxgl.GeoJSONSource).setData(
        geometry
      );
    } else {
      mapRef.current.addSource("route", { type: "geojson", data: geometry });
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#2563eb", "line-width": 5 },
      });
    }

    // Fit bounds to route
    const coords = geometry.coordinates;
    const bounds = coords.reduce(
      (b: mapboxgl.LngLatBounds, coord: [number, number]) => {
        return b.extend(coord);
      },
      new mapboxgl.LngLatBounds(coords[0], coords[0])
    );

    mapRef.current.fitBounds(bounds, { padding: 50 });
  };

  const popupContent = `
    <div>
      <p class="font-semibold">${
        property.location?.address || "Property Location"
      }</p>
      <p>${property.location?.city || ""}, ${property.location?.state || ""}</p>
    </div>
  `;

  return (
    <div>
      <div className="flex items-center justify-between pb-3 pt-5 mb-4">
        <h2 className="text-4xl font-bold leading-tight tracking-[-0.015em] ">
          Location
        </h2>
      </div>

      <div className="flex items-start justify-between flex-col md:flex-row gap-4 pb-3 pt-5 mb-8">
        <div>
          <p className="font-medium">{property.location?.address}</p>
          <p className="text-muted-foreground">
            {property.location?.city}, {property.location?.state}
          </p>
        </div>
        {property.location?.coordinates && (
          <button
            type="button"
            className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group h-full cursor-pointer dark:bg-white ms-auto"
            onClick={getDirections}
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
              <span className="inline-block text-black">Get Direction</span>
            </span>
          </button>
        )}
      </div>

      <MapViewer
        lat={property.location?.coordinates?.lat}
        lng={property.location?.coordinates?.lng}
        height={500}
        showMarker
        showPopup={true}
        interactive
        showControls
        popupContent={popupContent}
        zoom={14}
        className="!rounded-[30px]"
        onLoad={(map) => {
          mapRef.current = map;
        }}
      />
    </div>
  );
};

export default LocationTabContent;
