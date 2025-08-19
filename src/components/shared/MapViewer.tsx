"use client";

import { config } from "@/utils/config";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

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
  fitBounds?: mapboxgl.LngLatBoundsLike;
  style?: "auto" | "dark" | "streets" | string;
  onLoad?: (map: mapboxgl.Map) => void;
  onClick?: (coords: { lat: number; lng: number }) => void;
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
  fitBounds,
  style = "auto",
  onLoad,
  onClick,
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Get the appropriate map style based on theme
  const getMapStyle = () => {
    // If style is set to "auto", choose based on theme
    if (style === "auto") {
      return isDark ? MAP_STYLES.dark : MAP_STYLES.streets;
    }

    // If a specific style is requested
    if (style === "dark" || style === "streets") {
      return MAP_STYLES[style];
    }

    // Custom style URL
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

  // Function to toggle popup visibility
  const togglePopup = () => {
    if (!popupRef.current || !markerRef.current || !mapRef.current) return;

    const markerElement = markerRef.current.getElement();
    if (markerElement) {
      // Check if popup is currently open
      const isOpen = markerElement.classList.contains("mapboxgl-marker-active");

      if (isOpen) {
        popupRef.current.remove();
        markerElement.classList.remove("mapboxgl-marker-active");
      } else {
        const popupNode = createPopupContent(popupContent);
        popupRef.current.setDOMContent(popupNode);
        popupRef.current.addTo(mapRef.current);
        markerElement.classList.add("mapboxgl-marker-active");
      }
    }
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
        center: [lng, lat],
        zoom: zoom,
        interactive: interactive,
        attributionControl: false,
      });

      // Add navigation controls if enabled
      if (showControls && interactive) {
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
      }

      // Add fullscreen control
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      // Create popup instance (but don't add to map yet)
      popupRef.current = new mapboxgl.Popup({
        offset: 25,
        closeOnClick: true,
        closeButton: true,
        className: "mapboxgl-popup-custom",
      }).setLngLat([lng, lat]);

      // Add marker if enabled
      if (showMarker) {
        const marker = new mapboxgl.Marker({
          color: "var(--primary)",
        })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current = marker;

        // Add click event to marker to toggle popup
        marker.getElement().addEventListener("click", (e) => {
          e.stopPropagation();
          togglePopup();
        });

        // Add popup if enabled initially
        if (showPopup && popupContent) {
          const popupNode = createPopupContent(popupContent);
          popupRef.current.setDOMContent(popupNode);
          popupRef.current.addTo(map);

          // Add active class to marker
          marker.getElement().classList.add("mapboxgl-marker-active");
        }
      }

      // Fit bounds if provided
      if (fitBounds) {
        map.fitBounds(fitBounds, { padding: 50, maxZoom: 15 });
      }

      // Handle map click if interactive
      if (interactive && onClick) {
        map.on("click", (e) => {
          onClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });

          // Close popup if clicking elsewhere on the map
          if (popupRef.current && markerRef.current) {
            popupRef.current.remove();
            markerRef.current
              .getElement()
              .classList.remove("mapboxgl-marker-active");
          }
        });
      }

      // Handle popup close events
      if (popupRef.current) {
        popupRef.current.on("close", () => {
          if (markerRef.current) {
            markerRef.current
              .getElement()
              .classList.remove("mapboxgl-marker-active");
          }
        });
      }

      map.on("load", () => {
        setIsLoading(false);
        if (onLoad) {
          onLoad(map);
        }
      });

      mapRef.current = map;

      return () => {
        if (markerRef.current) {
          const markerElement = markerRef.current.getElement();
          if (markerElement) {
            markerElement.removeEventListener("click", togglePopup);
          }
          markerRef.current.remove();
        }
        if (popupRef.current) {
          popupRef.current.remove();
        }
        map.remove();
      };
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
      setIsLoading(false);
    }
  }, [mounted, interactive, showControls, theme]);

  // Update map style when theme changes
  useEffect(() => {
    if (mapRef.current && (style === "light" || style === "dark")) {
      const newStyle = getMapStyle();
      mapRef.current.setStyle(newStyle);
    }
  }, [isDark, style]);

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);

      if (popupRef.current) {
        popupRef.current.setLngLat([lng, lat]);
      }

      if (!fitBounds) {
        mapRef.current.flyTo({
          center: [lng, lat],
          essential: true,
        });
      }
    }
  }, [lat, lng, fitBounds]);

  // Update popup content
  useEffect(() => {
    if (popupRef.current && popupContent && mapRef.current) {
      const popupNode = createPopupContent(popupContent);

      // Only update if popup is currently open
      if (
        markerRef.current &&
        markerRef.current
          .getElement()
          .classList.contains("mapboxgl-marker-active")
      ) {
        popupRef.current.setDOMContent(popupNode);
      }
    }
  }, [popupContent, isDark]);

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
        <div className="flex items-center justify-center h-full bg-muted text-muted-foreground p-4 text-sm">
          Loading map...
        </div>
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
