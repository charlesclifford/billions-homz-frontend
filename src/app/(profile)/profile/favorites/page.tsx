import SavedItems from "@/components/profile/SavedItems";

export default function SavedPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Items</h1>
          <p className="text-muted-foreground mt-1">
            View your saved properties and estates
          </p>
        </div>
      </div>
      <SavedItems />
    </div>
  );
}
