"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

// Extend the mapboxgl types to include the missing properties
declare module "mapbox-gl" {
  interface Map {
    _controls: mapboxgl.IControl[];
  }
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapboxPickerProps {
  lat?: number;
  lng?: number;
  onSelect: (coords: { lat: number; lng: number }) => void;
  className?: string;
  height?: number | string;
  showMarker?: boolean;
  draggable?: boolean;
  zoom?: number;
}

export function MapboxPicker({
  lat = 9.082,
  lng = 8.6753,
  onSelect,
  className = "",
  height = 400,
  showMarker = true,
  draggable = true,
  zoom = 6,
}: MapboxPickerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) {
      setError(
        !mapboxgl.accessToken
          ? "Mapbox access token is missing"
          : "Map container not found"
      );
      return;
    }

    try {
      // Initialize map
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
        attributionControl: false,
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });
      map.addControl(geolocate);

      // Add marker if enabled
      if (showMarker) {
        const marker = new mapboxgl.Marker({
          draggable,
          color: "var(--primary)",
        })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current = marker;

        // Handle marker drag end
        if (draggable) {
          marker.on("dragend", () => {
            const newLngLat = marker.getLngLat();
            onSelect({ lat: newLngLat.lat, lng: newLngLat.lng });
          });
        }
      }

      // Handle map click
      map.on("click", (e) => {
        if (showMarker && markerRef.current) {
          markerRef.current.setLngLat(e.lngLat);
        }
        onSelect({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      });

      map.on("load", () => {
        setIsLoading(false);
      });

      mapRef.current = map;

      return () => {
        if (markerRef.current) {
          markerRef.current.remove();
        }
        map.remove();
      };
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
    }
  }, []);

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.flyTo({
        center: [lng, lat],
        essential: true,
      });
    }
  }, [lat, lng]);

  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`relative overflow-hidden rounded-md border ${className}`}
      style={containerStyle}
    >
      {error ? (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-input/30 text-red-600 p-4 text-sm">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-input/30 text-muted-foreground p-4 text-sm">
          Loading map...
        </div>
      ) : null}

      <div
        ref={mapContainer}
        className={`w-full h-full `}
        style={{ visibility: error || isLoading ? "hidden" : "visible" }}
      />
    </div>
  );
}
