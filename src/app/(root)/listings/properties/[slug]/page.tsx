import ClientPropertyDetails from "@/components/pages/property/ClientPropertyDetails";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import { IProperty } from "@/interfaces/property.interface";
import { getPropertyBySlug } from "@/lib/api/properties";
import { formatCurrency } from "@/utils/helpers";
import {
  BuildingIcon,
  CurrencyIcon,
  LucideSquareStack,
  MapPin,
  RulerDimensionLine,
} from "lucide-react";
import { notFound } from "next/navigation";
import { SummaryItem } from "../../estates/[slug]/page";

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
        bgImage={property.images[0].imageUrl}
        className="pt-[10%] bg-fixed"
      />

      {/* Header Section */}
      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 mt-[50px] mb-[100px] flex flex-col">
        {/* Header Info */}
        <div className="mb-5 inline-flex">
          <MapPin className="mr-2 text-primary" />
          <span className="font-semibold">
            {property.location?.city}, {property.location?.state}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <h2 className="mb-[13px] tracking-[-2px] leading-[1] text-[45px] lg:text-[70px] font-bold capitalize">
            {property.title}
          </h2>
        </div>

        <Separator className="mt-5" />
        <div className="mb-[50px]">
          <div className="pt-[45px] items-center gap-4 grid md:grid-cols-3 lg:grid-cols-5">
            <SummaryItem
              icon={<LucideSquareStack />}
              label="Status"
              value={
                property.status.charAt(0).toUpperCase() +
                property.status.slice(1)
              }
            />
            <SummaryItem
              icon={<BuildingIcon />}
              label="Project Type"
              value={
                property.type.charAt(0).toUpperCase() + property.type.slice(1)
              }
            />
            {property.dimensions && (
              <SummaryItem
                icon={<RulerDimensionLine />}
                label="Project Area"
                value={`${property.dimensions} sq. ft`}
              />
            )}
            <SummaryItem
              icon={<CurrencyIcon />}
              label="Price"
              value={formatCurrency(property.price)}
            />
          </div>
        </div>

        {/* details tabs */}
        <ClientPropertyDetails property={property} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
