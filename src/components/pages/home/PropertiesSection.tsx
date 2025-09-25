"use client";

import SmallTitle from "@/components/shared/SmallTitle";
import useProperties from "@/hooks/useProperties";
import useEstates from "@/hooks/useEstates";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "../property/PropertyCard";
import PropertyCardSkeleton from "../property/PropertyCardSkeleton";
import EstateCardSkeleton from "../property/EstateCardSkeleton";
import EstateCard from "../property/EstateCard";

export default function PropertiesSection() {
  const { isPending: loadingProperties, properties } = useProperties({
    page: 1,
    limit: 3,
  });
  const { isPending: loadingEstates, estates } = useEstates({
    page: 1,
    limit: 3,
  });

  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: (i = 0) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SmallTitle text="Listings" className="mx-auto" />
        </motion.div>

        <motion.div
          className="mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <p className="text-lg md:text-xl font-medium mb-4 text-center">
            Explore our curated estates and properties to find your dream home.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px] max-w-5xl">
            Featured Listings
          </h2>
        </motion.div>

        {/* Tabs for Estates / Properties */}
        <Tabs defaultValue="properties" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid w-[300px] grid-cols-2 bg-muted/50 rounded-full">
              <TabsTrigger
                value="properties"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Properties
              </TabsTrigger>
              <TabsTrigger
                value="estates"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Estates
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingProperties
                ? [...Array(3)].map((_, i) => <PropertyCardSkeleton key={i} />)
                : properties.map((property, i) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
            </div>
            <CTA href="/listings/properties" label="View All Properties" />
          </TabsContent>

          {/* Estates Tab */}
          <TabsContent value="estates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingEstates
                ? [...Array(3)].map((_, i) => <EstateCardSkeleton key={i} />)
                : estates.map((estate, i) => (
                    <motion.div
                      key={estate._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <EstateCard estate={estate} />
                    </motion.div>
                  ))}
            </div>
            <CTA href="/listings/estates" label="View All Estates" />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function CTA({ href, label }: { href: string; label: string }) {
  return (
    <motion.div
      className="flex items-center justify-center pt-10"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Link
        href={href}
        className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group transition duration-300 dark:bg-white overflow-hidden"
      >
        <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
          <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
            <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
              {/* Top icon – animates out along 45deg */}
              <span className="flex absolute items-center justify-center  transition-all duration-500 transform-3d transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] opacity-100 group-hover:transform-[translate3d(17px,-17px,0px)_scale3d(0.2,0.2,1)] group-hover:opacity-0">
                <ArrowUpRight />
              </span>

              {/* Bottom icon – animates in along 45deg */}
              <span className="flex absolute items-center justify-center  transition-all duration-500 transform-[translate3d(-17px,17px,0px)_scale3d(0.2,0.2,1)_rotate(-45deg)] opacity-0 group-hover:transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] group-hover:opacity-100">
                <ArrowUpRight />
              </span>
            </span>
          </span>
          <span className="inline-block text-black">{label}</span>
        </span>
      </Link>
    </motion.div>
  );
}
