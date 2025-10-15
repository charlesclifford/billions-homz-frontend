"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EstateCard from "../pages/property/EstateCard";
import PropertyCard from "../pages/property/PropertyCard";

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const { data: favorites, isLoading, isError } = useFavorites();

  const properties = favorites?.properties;
  const estates = favorites?.estates;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
          <TabsTrigger value="estates" className="flex-1">
            Estates
          </TabsTrigger>
        </TabsList>

        {/* --- PROPERTIES TAB --- */}
        <TabsContent value="properties" className="mt-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : isError ? (
            <p className="text-center text-destructive">Failed to load data.</p>
          ) : properties && properties.length === 0 ? (
            <EmptyState
              title="No saved properties yet"
              description="Start exploring our listings and save your favorite properties to view them here."
              link="/listings/properties"
              linkText="Browse Properties"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties &&
                properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
            </div>
          )}
        </TabsContent>

        {/* --- ESTATES TAB --- */}
        <TabsContent value="estates" className="mt-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : isError ? (
            <p className="text-center text-destructive">Failed to load data.</p>
          ) : estates && estates.length === 0 ? (
            <EmptyState
              title="No saved estates yet"
              description="Start exploring estates and save your favorites to view them here."
              link="/listings/estates"
              linkText="Browse Estates"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {estates &&
                estates.map((estate) => (
                  <EstateCard key={estate._id} estate={estate} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedItems;

function EmptyState({
  title,
  description,
  link,
  linkText,
}: {
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="size-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        <Button asChild>
          <Link href={link}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
