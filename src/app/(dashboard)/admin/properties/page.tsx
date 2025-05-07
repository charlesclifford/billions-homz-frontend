import PropertiesContent from "@/components/admin/properties/PropertiesContent";
import PropertiesFilter from "@/components/admin/properties/PropertiesFilter";
import PropertyHeader from "@/components/admin/properties/PropertyHeader";

const PropertiesPage = () => {
  return (
    <div className="w-full">
      <PropertyHeader />

      <div className="space-y-8">
        <PropertiesFilter />

        <div className="w-full">
          <PropertiesContent />
          <PropertiesContent />
          <PropertiesContent />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
