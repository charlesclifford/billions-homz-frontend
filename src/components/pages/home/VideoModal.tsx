import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ITestimonial } from "@/interfaces/testimonial.interface";
import { X } from "lucide-react";

const VideoModal = ({
  testimonial,
  isOpen,
  onClose,
}: {
  testimonial: ITestimonial | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!testimonial) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-6xl w-full h-[90vh] p-0 bg-black border-none overflow-hidden [&>button]:hidden">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 bg-black/70 text-white hover:text-white hover:bg-black/90 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contained Video Player */}
        <div className="flex items-center justify-center w-full h-full bg-black overflow-hidden">
          <video
            src={testimonial.media.url}
            poster={testimonial.media.thumbnailUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
