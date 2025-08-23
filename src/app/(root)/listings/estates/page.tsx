import EstateListFilter from "@/components/pages/property/EstateListFilter";
import EstatesList from "@/components/pages/property/EstatesList";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import React from "react";

const EstatesPage = () => {
  return (
    <div className="w-full">
      <PageHeader
        title="Our Estates"
        bgImage="/images/bg/land-plot-with-nature-landscape-location-pin.jpg"
      />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 mt-10">
        <EstateListFilter />
        <Separator />

        <div className="py-10">
          <EstatesList />
        </div>
      </div>
    </div>
  );
};

export default EstatesPage;
