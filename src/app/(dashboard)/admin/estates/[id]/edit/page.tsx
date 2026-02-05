import EstateForm from "@/components/admin/properties/EstateForm";
import { IEstate } from "@/interfaces/estate.interface";
import { getEstateById } from "@/lib/api/properties";
import { notFound } from "next/navigation";
import React from "react";

const EstateEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = await getEstateById(id);

  const estate = data as IEstate;

  if (!estate) {
    return notFound();
  }

  return (
    <div className="">
      <EstateForm initialValues={estate} />
    </div>
  );
};

export default EstateEditPage;
