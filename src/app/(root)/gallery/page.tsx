import GalleryGrid from "@/components/pages/gallery/GalleryGrid";
import PageHeader from "@/components/shared/PageHeader";
import bgImg from "../../../../public/images/bg/camera-board-with-negatives.jpg";

const GalleryPage = () => {
  return (
    <div className="w-full h-full">
      <PageHeader title="Our Gallery" bgImage={bgImg} />

      <div className="container max-w-[min(100%,1290px)] mx-auto px-4 py-16">
        <GalleryGrid />
      </div>
    </div>
  );
};

export default GalleryPage;
