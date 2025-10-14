import BookingInspectionCard from "@/components/pages/property/BookingInspectionCard";
import EstateShareButtons from "@/components/pages/property/EstateShareButtons";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IEstate } from "@/interfaces/estate.interface";
import { getAllEstates, getEstateBySlug } from "@/lib/api/properties";
import { config } from "@/utils/config";
import { formatCurrency } from "@/utils/helpers";
import {
  CurrencyIcon,
  LucideSquareStack,
  MapPin,
  RulerDimensionLine,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

const { SITE_URL } = config;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEstateBySlug(slug);
  const estate = data.data as IEstate;

  if (!estate) {
    notFound();
  }

  const url = `${SITE_URL}/listings/estates/${estate.slug}`;

  return {
    title: estate.name,
    description:
      estate.description?.slice(0, 160) || "View details about this property.",
    alternates: {
      canonical: url, // ✅ Correct canonical per estate
    },
    openGraph: {
      title: estate.name,
      description: estate.description,
      url,
      images: [
        {
          url:
            estate.bannerImage?.imageUrl ||
            `/logos/billions-whatsapp.jpg`,
          width: 1200,
          height: 630,
          alt: estate.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: estate.name,
      description: estate.description,
      images: [
        estate.bannerImage?.imageUrl ||
          `/logos/billions-whatsapp.jpg`,
      ],
    },
  };
}

export const generateStaticParams = async () => {
  let estates = [];
  try {
    const data = await getAllEstates({
      page: 1,
      limit: 50,
    });

    estates = data.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return estates.map((estate: any) => ({
      // id: post?._id,
      slug: estate?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const EstateDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const data = await getEstateBySlug(slug);
  const estate = data.data as IEstate;

  if (!estate) return notFound();

  // Create share URL
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/properties/${estate.slug}`
      : `https://yourdomain.com/properties/${estate.slug}`;
  const shareTitle = `Check out ${estate.name} in ${estate.location?.city}`;

  return (
    <div className="">
      <PageHeader
        title=""
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/faq-bc.jpg"
      />

      {/* Header Section */}
      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 mt-[50px] mb-[100px] flex flex-col">
        <div className="mb-5 inline-flex">
          <MapPin className="mr-2 text-primary" />
          <span className="font-semibold">
            {estate.location?.city}, {estate.location?.state}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <h2 className="mb-[13px] tracking-[-2px] leading-[1] text-[45px] lg:text-[70px] font-bold capitalize">
            {estate.name}
          </h2>
        </div>

        <Separator className="mt-5" />
        <div className="flex flex-row mb-[50px]">
          <div className="pt-[45px] flex items-center gap-[65px]">
            <SummaryItem
              icon={<LucideSquareStack />}
              label="Status"
              value={
                estate.soldUnits === estate.totalUnits
                  ? "Sold Out"
                  : estate.soldUnits && estate.soldUnits > 0
                  ? "Now Selling"
                  : "Available"
              }
            />
            {estate.plotSize && (
              <SummaryItem
                icon={<RulerDimensionLine />}
                label="Project Area"
                value={`${estate.plotSize} sq. ft`}
              />
            )}
            <SummaryItem
              icon={<CurrencyIcon />}
              label="Price Range"
              value={`${formatCurrency(estate?.price || 0)}`}
            />
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 ">
          {/* Main Content (Left) */}
          <div className="flex-1">
            {/* Banner Image */}
            {estate.bannerImage?.imageUrl && (
              <div className="overflow-hidden mb-8">
                <Image
                  src={estate.bannerImage.imageUrl}
                  alt={estate.name}
                  width={800}
                  height={1200}
                  className="w-full h-auto max-h-[600px] object-contain"
                  priority
                />
              </div>
            )}

            <div>
              {/* Project Description */}
              <div className="mb-8">
                <div className="mb-[25px]">
                  <h3 className="text-[36px] lg:text-[52px] tracking-[-1px] font-bold">
                    Project description
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {estate.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="mb-8">
              <div className="mb-[25px]">
                <h3 className="text-[36px] lg:text-[52px] tracking-[-1px] font-bold">
                  Features
                </h3>
              </div>
              {estate.features?.length ? (
                <div className="flex flex-wrap gap-2">
                  {estate.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No features listed.</p>
              )}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:w-80 xl:w-96 space-y-6 relative">
            {/* Social Sharing Card */}
            <div className="rounded-[30px] border p-8 ">
              <EstateShareButtons
                url={shareUrl}
                title={shareTitle}
                propertyName={estate.name}
                variant="card"
                className=""
              />
            </div>

            {/* Contact/CTA Card */}
            <div className=" sticky top-8 flex flex-col gap-8">
              <div className="bg-primary/20 p-8 rounded-[30px]">
                <h3 className="text-lg font-semibold mb-3">
                  Interested in this property?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Contact us for more information or to schedule a viewing.
                </p>
                <Button
                  size={"lg"}
                  className="w-full rounded-[30px] cursor-pointer"
                >
                  Contact Agent
                </Button>
              </div>

              <BookingInspectionCard property={estate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateDetailsPage;

// Components (keep these at the bottom of the file)
export const SummaryItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="h-full">
    <div className="flex items-center">
      <div className="mr-[15px] flex border p-[18px] rounded-full tracking-[0px] leading-[1.5em]">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-muted-foreground font-semibold">{label}</h3>
        <p className="font-medium text-lg leading-[1.5em]">{value}</p>
      </div>
    </div>
  </div>
);
