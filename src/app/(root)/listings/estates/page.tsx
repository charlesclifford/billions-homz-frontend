import EstatesList from "@/components/pages/property/EstatesList";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import React from "react";

const EstatesPage = () => {
  return (
    <div className="w-full">
      <PageHeader
        title="Our Estates"
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/faq-bc.jpg"
      />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
        <div></div>
        <Separator />

        <div>
          <EstatesList />
        </div>
      </div>
    </div>
  );
};

export default EstatesPage;
