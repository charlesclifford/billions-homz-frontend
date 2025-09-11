import PropertyForm from "@/components/admin/properties/PropertyForm";
import { IProperty } from "@/interfaces/property.interface";
import { getPropertyById } from "@/lib/api/properties";
import { notFound } from "next/navigation";

const PropertyEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = await getPropertyById(id);

  const property = data as IProperty;

  if (!property) {
    return notFound();
  }

  return (
    <div className="">
      <PropertyForm initialValues={property} />
    </div>
  );
};

export default PropertyEditPage;
