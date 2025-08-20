import { MapViewer } from "@/components/shared/MapViewer";
import { IProperty } from "@/interfaces/property.interface";
import React from "react";

const LocationTabContent = ({ property }: { property: IProperty }) => {
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
      <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
        Location
      </h2>

      <div className="space-y-4">
        <div>
          <p className="font-medium">{property.location?.address}</p>
          <p className="text-muted-foreground">
            {property.location?.city}, {property.location?.state}
          </p>
        </div>
        <MapViewer
          lat={property.location?.coordinates?.lat}
          lng={property.location?.coordinates?.lng}
          height={500}
          showMarker
          showPopup={true}
          interactive={false}
          showControls
          popupContent={popupContent}
          zoom={14}
          className="rounded-[30px]"
        />
      </div>
    </div>
  );
};

export default LocationTabContent;
