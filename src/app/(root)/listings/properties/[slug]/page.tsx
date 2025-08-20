import ClientPropertyDetails from "@/components/pages/property/ClientPropertyDetails";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import { IProperty } from "@/interfaces/property.interface";
import { getPropertyBySlug } from "@/lib/api/properties";
import { formatCurrency } from "@/utils/helpers";
import { CurrencyIcon, MapPin, RulerDimensionLine } from "lucide-react";
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
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/faq-bc.jpg"
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
        <div className="flex flex-row mb-[50px]">
          <div className="pt-[45px] flex items-center gap-[65px]">
            {property.dimensions && (
              <SummaryItem
                icon={<RulerDimensionLine />}
                label="Project Area"
                value={`${property.dimensions} sq. ft`}
              />
            )}
            <SummaryItem
              icon={<CurrencyIcon />}
              label="Price Range"
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
