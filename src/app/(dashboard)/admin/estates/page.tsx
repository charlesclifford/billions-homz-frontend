import EstateContent from "@/components/admin/properties/EstateContent";
import EstateHeader from "@/components/admin/properties/EstateHeader";

const EstatesPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <EstateHeader />

      <EstateContent />
    </div>
  );
};

export default EstatesPage;
