import EstateContent from "@/components/admin/properties/EstateContent";
import EstateFilter from "@/components/admin/properties/EstateFilter";
import EstateHeader from "@/components/admin/properties/EstateHeader";

const EstatesPage = () => {
  return (
    <div className="w-full">
      <EstateHeader />

      <div className="space-y-8">
        <EstateFilter />

        <div>
          <EstateContent />
        </div>
      </div>
    </div>
  );
};

export default EstatesPage;
