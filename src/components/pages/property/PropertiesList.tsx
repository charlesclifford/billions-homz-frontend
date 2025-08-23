"use client";
import React, { useState, useMemo } from "react";
import { getPaginationRange } from "@/components/shared/DataTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import useProperties from "@/hooks/useProperties";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import PropertyCard from "./PropertyCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/features/property/property.slice";
import { MapViewer } from "@/components/shared/MapViewer";
import { formatCurrency } from "@/utils/helpers";
import mapboxgl from "mapbox-gl";
import { Skeleton } from "@/components/ui/skeleton";

const PropertiesList = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.property);
  const { isPending, properties, totalPages } = useProperties({
    ...filter,
    limit: 20,
  });
  const [showMap, setShowMap] = useState(false);

  const onPaginationChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(setFilter({ page }));
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  // Calculate bounds for all properties with coordinates
  const fitBounds = useMemo(() => {
    if (!properties || properties.length === 0) return undefined;

    const bounds = new mapboxgl.LngLatBounds();

    properties.forEach((property) => {
      const lat = property.location?.coordinates?.lat;
      const lng = property.location?.coordinates?.lng;

      if (lat !== undefined && lng !== undefined) {
        bounds.extend([lng, lat]);
      }
    });

    // If less than 2 valid coordinates, don't fit bounds
    if (bounds.isEmpty()) return undefined;

    return bounds;
  }, [properties]);

  // Prepare locations for MapViewer
  const mapLocations = useMemo(() => {
    if (!properties) return [];

    return properties
      .filter(
        (property) =>
          property.location?.coordinates?.lat !== undefined &&
          property.location?.coordinates?.lng !== undefined
      )
      .map((property) => ({
        lat: property.location!.coordinates!.lat!,
        lng: property.location!.coordinates!.lng!,
        id: property._id,
        popupContent: `
          <div>
            <p class="font-semibold capitalize">${property.title}</p>
            <p>${property.location?.address || ""}, ${
          property.location?.city || ""
        }</p>
            <p class="text-primary font-bold mt-2">${
              property.price
                ? formatCurrency(property.price)
                : "Price not available"
            }</p>
           
          </div>
        `,
      }));
  }, [properties]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {/* Properties ({properties?.length || 0}) */}
        </h2>
        <div className="flex items-center space-x-2 ml-auto">
          <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          <Switch
            id="map-toggle"
            className="cursor-pointer"
            checked={showMap}
            onCheckedChange={toggleMapView}
          />
          <Label
            htmlFor="map-toggle"
            className="flex items-center cursor-pointer"
          >
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="hidden sm:inline">
              {showMap ? "Hide Map" : "Show Map"}
            </span>
          </Label>
        </div>
      </div>

      {/* Cards + Map */}
      <div className="flex flex-col-reverse lg:grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
        {/* Cards section */}
        <div
          className={cn(
            "grid gap-6 transition-all duration-300",
            showMap ? "lg:grid-cols-2 lg:col-span-2" : "lg:grid-cols-3 lg:col-span-3"
          )}
        >
          {isPending
            ? [...Array(8)].map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties?.map((p) => (
                <div key={p._id} id={`property-${p._id}`}>
                  <PropertyCard property={p} />
                </div>
              ))}
        </div>

        {/* Map section */}
        {showMap && (
          <div className="col-span-1 h-[350px] lg:h-[700px] rounded-[30px] overflow-hidden border transition-all duration-300">
            {isPending ? (
              <Skeleton className="h-full flex items-center justify-center bg-muted">
                <div className="text-muted-foreground text-sm">
                  Loading map...
                </div>
              </Skeleton>
            ) : (
              <MapViewer
                key={filter.page}
                locations={mapLocations}
                height="100%"
                showMarker
                showPopup={false}
                interactive
                showControls
                fitBounds={fitBounds}
                onMarkerClick={(loc) => {
                  const el = document.getElementById(`${loc.id}`);
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {properties && properties.length > 0 && totalPages > 1 && (
        <Pagination className="mt-8 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPaginationChange(filter.page - 1)}
                aria-disabled={filter.page === 1}
                className={cn(
                  "cursor-pointer rounded-full w-10 h-10",
                  filter.page === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {getPaginationRange(filter.page, totalPages).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === filter.page}
                  className={cn(
                    "cursor-pointer rounded-full w-10 h-10 hover:bg-primary hover:text-white",
                    page === filter.page && "bg-primary text-white"
                  )}
                  onClick={() => onPaginationChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPaginationChange(filter.page + 1)}
                aria-disabled={filter.page >= totalPages}
                className={cn(
                  "cursor-pointer rounded-full w-10 h-10",
                  filter.page >= totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PropertiesList;
