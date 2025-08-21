"use client";

import { config } from "@/utils/config";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";

// Extend the mapboxgl types to include the missing properties
declare module "mapbox-gl" {
  interface Map {
    _controls: mapboxgl.IControl[];
  }
}

const { MAPBOX_ACCESS_TOKEN } = config;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Map styles for different themes
const MAP_STYLES = {
  dark: "mapbox://styles/mapbox/dark-v11",
  streets: "mapbox://styles/mapbox/streets-v12",
};

export interface Location {
  lat: number;
  lng: number;
  popupContent?: string;
  id?: string;
}

interface MapViewerProps {
  lat?: number;
  lng?: number;
  className?: string;
  height?: number | string;
  width?: number | string;
  showMarker?: boolean;
  zoom?: number;
  interactive?: boolean;
  showControls?: boolean;
  showPopup?: boolean;
  popupContent?: string | React.ReactNode;
  locations?: Location[];
  fitBounds?: mapboxgl.LngLatBoundsLike;
  style?: "auto" | "dark" | "streets" | string;
  onLoad?: (map: mapboxgl.Map) => void;
  onClick?: (coords: { lat: number; lng: number }) => void;
  onMarkerClick?: (location: Location, index: number) => void;
}

export function MapViewer({
  lat = 4.8156,
  lng = 7.0498,
  className = "",
  height = 400,
  width = "100%",
  showMarker = true,
  zoom = 13,
  interactive = true,
  showControls = true,
  showPopup = false,
  popupContent = "",
  locations = [],
  fitBounds,
  style = "auto",
  onLoad,
  onClick,
  onMarkerClick,
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Get the appropriate map style based on theme
  const getMapStyle = () => {
    if (style === "auto") {
      return isDark ? MAP_STYLES.dark : MAP_STYLES.streets;
    }

    if (style === "dark" || style === "streets") {
      return MAP_STYLES[style];
    }

    return style;
  };

  // Avoid hydration mismatch by waiting for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to create popup content
  const createPopupContent = (content: string | React.ReactNode) => {
    const popupNode = document.createElement("div");
    popupNode.className = `p-3 text-foreground bg-background`;

    if (typeof content === "string") {
      popupNode.innerHTML = content;
    } else {
      popupNode.textContent = "Popup content";
    }

    return popupNode;
  };

  // Clear all markers and popups
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    popupsRef.current.forEach((popup) => popup.remove());
    markersRef.current = [];
    popupsRef.current = [];
  };

  // Toggle popup visibility for a specific marker
  const togglePopup = (index: number) => {
    if (!mapRef.current || index >= popupsRef.current.length) return;

    const popup = popupsRef.current[index];
    const marker = markersRef.current[index];

    if (!popup || !marker) return;

    if (activePopupIndex === index) {
      // Close the popup
      popup.remove();
      marker.getElement().classList.remove("mapboxgl-marker-active");
      setActivePopupIndex(null);
    } else {
      // Close any currently open popup
      if (
        activePopupIndex !== null &&
        activePopupIndex < popupsRef.current.length
      ) {
        popupsRef.current[activePopupIndex].remove();
        markersRef.current[activePopupIndex]
          .getElement()
          .classList.remove("mapboxgl-marker-active");
      }

      // Open the new popup
      popup.addTo(mapRef.current);
      marker.getElement().classList.add("mapboxgl-marker-active");
      setActivePopupIndex(index);
    }
  };

  // Add markers to the map
  const addMarkers = () => {
    if (!mapRef.current) return;

    clearMarkers();

    // Add single marker if no locations provided
    if (locations.length === 0 && showMarker) {
      const marker = new mapboxgl.Marker({
        color: "var(--primary)",
      })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markersRef.current = [marker];

      if (popupContent) {
        const popupNode = createPopupContent(popupContent);
        const popup = new mapboxgl.Popup({
          offset: 25,
          className: "mapboxgl-popup-custom",
        })
          .setLngLat([lng, lat])
          .setDOMContent(popupNode);

        popupsRef.current = [popup];

        // Show popup initially if showPopup is true
        if (showPopup) {
          popup.addTo(mapRef.current);
          marker.getElement().classList.add("mapboxgl-marker-active");
          setActivePopupIndex(0);
        }
      }

      // Add click event to marker
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        if (popupContent) {
          togglePopup(0);
        }
        if (onMarkerClick) {
          onMarkerClick(
            {
              lat,
              lng,
              popupContent:
                typeof popupContent === "string" ? popupContent : "",
            },
            0
          );
        }
      });

      return;
    }

    // Add multiple markers if locations provided
    locations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({
        color: "var(--primary)",
      })
        .setLngLat([location.lng, location.lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);

      if (location.popupContent) {
        const popupNode = createPopupContent(location.popupContent);
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat([location.lng, location.lat])
          .setDOMContent(popupNode);

        popupsRef.current.push(popup);

        // Show popup initially if showPopup is true and it's the first marker
        if (showPopup && index === 0) {
          popup.addTo(mapRef.current!);
          marker.getElement().classList.add("mapboxgl-marker-active");
          setActivePopupIndex(0);
        }
      }

      // Add click event to marker
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        if (location.popupContent) {
          togglePopup(index);
        }
        if (onMarkerClick) {
          onMarkerClick(location, index);
        }
      });
    });
  };

  useEffect(() => {
    if (!mounted) return;

    if (!mapContainer.current || !mapboxgl.accessToken) {
      setError(
        !mapboxgl.accessToken
          ? "Mapbox access token is missing"
          : "Map container not found"
      );
      setIsLoading(false);
      return;
    }

    try {
      // Initialize map
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: getMapStyle(),
        center:
          locations.length > 0
            ? [locations[0].lng, locations[0].lat]
            : [lng, lat],
        zoom: zoom,
        interactive: interactive,
        attributionControl: false,
      });

      // Add navigation controls if enabled
      if (showControls && interactive) {
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Add geolocate control
        // const geolocate = new mapboxgl.GeolocateControl({
        //   positionOptions: {
        //     enableHighAccuracy: true,
        //   },
        //   trackUserLocation: true,
        //   showUserHeading: true,
        // });
        // map.addControl(geolocate);
      }

      // Add fullscreen control
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      // Fit bounds if provided
      if (fitBounds) {
        map.fitBounds(fitBounds, { padding: 50, maxZoom: 15 });
      }

      // Handle map click if interactive
      if (interactive && onClick) {
        map.on("click", (e) => {
          onClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });

          // Close any open popup when clicking on the map
          if (activePopupIndex !== null) {
            popupsRef.current[activePopupIndex].remove();
            markersRef.current[activePopupIndex]
              .getElement()
              .classList.remove("mapboxgl-marker-active");
            setActivePopupIndex(null);
          }
        });
      }

      map.on("load", () => {
        setIsLoading(false);
        // Add markers after map is loaded
        addMarkers();
        if (onLoad) {
          onLoad(map);
        }
      });

      mapRef.current = map;

      return () => {
        clearMarkers();
        map.remove();
      };
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
      setIsLoading(false);
    }
  }, [mounted, interactive, showControls, theme]);

  // Update markers when locations or showPopup changes
  useEffect(() => {
    if (mapRef.current) {
      addMarkers();
    }
  }, [locations, showPopup, popupContent]);

  // Update map style when theme changes
  useEffect(() => {
    if (mapRef.current && style === "auto") {
      const newStyle = getMapStyle();
      mapRef.current.setStyle(newStyle);

      // Re-add markers after style change
      mapRef.current.once("styledata", () => {
        addMarkers();
      });
    }
  }, [isDark, style]);

  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  return (
    <div
      className={`relative overflow-hidden rounded-md border bg-muted ${className}`}
      style={containerStyle}
    >
      {error ? (
        <div className="flex items-center justify-center h-full bg-muted text-destructive p-4 text-sm">
          {error}
        </div>
      ) : isLoading ? (
        <Skeleton className="flex items-center justify-center h-full bg-muted text-muted-foreground p-4 text-sm">
          Loading map...
        </Skeleton>
      ) : null}

      <div
        ref={mapContainer}
        className={`w-full h-full`}
        style={{ visibility: error || isLoading ? "hidden" : "visible" }}
      />

      {/* Add some custom styles for the active marker state */}
      <style jsx>{`
        :global(.mapboxgl-popup-custom .mapboxgl-popup-content) {
          background: var(--background);
          color: var(--foreground);
          border-radius: 0.5rem;
          padding: 0;
        }

        :global(.mapboxgl-popup-custom .mapboxgl-popup-close-button) {
          color: var(--foreground);
          padding: 4px 8px;
          font-size: 16px;
        }

        :global(.mapboxgl-popup-custom .mapboxgl-popup-close-button:hover) {
          color: var(--destructive);
          background-color: transparent;
        }

        :global(.mapboxgl-popup-custom .mapboxgl-popup-tip) {
          border-top-color: var(--background) !important;
        }

        :global(.mapboxgl-popup-anchor-top .mapboxgl-popup-tip) {
          border-bottom-color: var(--background) !important;
        }
        :global(.mapboxgl-popup-anchor-right .mapboxgl-popup-tip) {
          border-left-color: var(--background) !important;
        }
        :global(.mapboxgl-popup-anchor-left .mapboxgl-popup-tip) {
          border-right-color: var(--background) !important;
        }
      `}</style>
    </div>
  );
}
