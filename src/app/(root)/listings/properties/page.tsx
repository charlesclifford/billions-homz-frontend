import PropertiesList from "@/components/pages/property/PropertiesList";
import PropertiesListFilter from "@/components/pages/property/PropertiesListFilter";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import React from "react";

const PropertiesPage = () => {
  redirect("/listings/estates");

  return (
    <div className="w-full">
      <PageHeader
        title="Our Properties"
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/faq-bc.jpg"
      />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 mt-10">
        <PropertiesListFilter />
        <Separator />

        <div className="py-10">
          <PropertiesList />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
