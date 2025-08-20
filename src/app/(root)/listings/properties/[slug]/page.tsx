import PageHeader from "@/components/shared/PageHeader";
import { IProperty } from "@/interfaces/property.interface";
import { getPropertyBySlug } from "@/lib/api/properties";
import { notFound } from "next/navigation";
import React from "react";

const PropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const data = await getPropertyBySlug(slug);
  const property = data.data as IProperty;

  if (!property) return notFound();

  return (
    <div>
      <PageHeader
        title=""
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/faq-bc.jpg"
      />
    </div>
  );
};

export default PropertyDetailsPage;
