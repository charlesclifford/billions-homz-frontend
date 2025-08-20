"use client";
import InfoTabContent from "@/components/pages/property/InfoTabContent";
import VirtualTourTabContent from "@/components/pages/property/VirtualTourTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProperty } from "@/interfaces/property.interface";
import React, { Suspense, useMemo } from "react";
import GalleryTabContent from "./GalleryTabContent";
import LocationTabContent from "./LocationTabContent";

interface ITab {
  title: string;
  key: string;
  content?: React.ReactNode;
}

const ClientPropertyDetails = ({ property }: { property: IProperty }) => {
  // Memoized tabs configuration
  const tabs = useMemo(() => {
    const baseTabs: ITab[] = [
      {
        title: "Info",
        key: "info",
        content: <InfoTabContent />,
      },
      {
        title: "Location",
        key: "location",
        content: <LocationTabContent property={property} />,
      },
      {
        title: "Gallery",
        key: "gallery",
        content: <GalleryTabContent images={property?.images || []} />,
      },
    ];

    if (property?.virtualTour) {
      baseTabs.push({
        title: "Virtual Tour",
        key: "virtualTour",
        content: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }
          >
            <VirtualTourTabContent property={property} />
          </Suspense>
        ),
      });
    }

    return baseTabs;
  }, [property]);

  if (!property) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold">Property not found</h2>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Tabs defaultValue={tabs[0].key} className="gap-0">
          <TabsList className="bg-transparent border-b rounded-none w-full py-0 h-10 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-11">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="border-b-[3px] border-b-transparent text-muted-foreground data-[state=active]:border-b-primary  data-[state=active]:text-[#0d141c] text-base font-bold rounded-none data-[state=active]:shadow-none dark:data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent dark:data-[state=active]:border-b-primary h-full cursor-pointer"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* <Separator /> */}

          {tabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPropertyDetails;
