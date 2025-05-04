import NewPropertyForm from "@/components/admin/properties/NewPropertyForm";
import React from "react";

const CreatePropertyPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      </div>
      <NewPropertyForm />
    </div>
  );
};

export default CreatePropertyPage;
