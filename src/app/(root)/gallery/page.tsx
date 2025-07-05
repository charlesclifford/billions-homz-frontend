import GalleryGrid from "@/components/pages/gallery/GalleryGrid";
import PageHeader from "@/components/shared/PageHeader";

const GalleryPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader
        title="Our Gallery"
        bgImage="https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/blog-bc.jpg"
      />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
        <GalleryGrid />
      </div>
    </div>
  );
};

export default GalleryPage;
