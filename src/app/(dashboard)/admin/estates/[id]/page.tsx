import EstateForm from "@/components/admin/properties/EstateForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { IEstate } from "@/interfaces/estate.interface";
import { getEstateById } from "@/lib/api/properties";
import { notFound } from "next/navigation";

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
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="hidden sm:flex mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/estates">Estates</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{estate.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6 capitalize">{estate.name}</h1>
      <EstateForm initialValues={estate} />
    </div>
  );
};

export default EstateEditPage;
