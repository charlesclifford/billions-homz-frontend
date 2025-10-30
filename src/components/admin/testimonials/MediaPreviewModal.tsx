import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ITestimonial,
  TestimonialMedia,
} from "@/interfaces/testimonial.interface";
import { formatFileSize } from "@/utils/helpers";
import { ImageIcon, Star, X } from "lucide-react";
import Image from "next/image";

export const MediaPreviewModal = ({
  open,
  onClose,
  media,
  testimonial,
}: {
  open: boolean;
  onClose: () => void;
  media: TestimonialMedia | null;
  testimonial: ITestimonial | null;
}) => {
  const isVideo = media?.type === "video";
  const isImage = media?.type === "image";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-xl w-full h-full lg:h-[calc(100vh-50px)] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>Preview</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="flex flex-col gap-6 py-4">
            {/* Media Display */}
            <div className="flex-1">
              <div className="bg-black rounded-lg overflow-hidden">
                {isVideo ? (
                  <video
                    src={media?.url}
                    poster={media?.thumbnailUrl}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh] object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : isImage ? (
                  <Image
                    src={media?.url}
                    alt={testimonial?.name || ""}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-white">
                    <ImageIcon className="h-16 w-16" />
                    <p>No media available</p>
                  </div>
                )}
              </div>
            </div>
            {/* Testimonial Details */}
            {testimonial && (
              <Card>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Name
                    </h4>
                    <p>{testimonial.name}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Position
                    </h4>
                    <p>{testimonial.position}</p>
                  </div>

                  {testimonial.company && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Company
                      </h4>
                      <p>{testimonial.company}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Content
                    </h4>
                    <p className="mt-1 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {testimonial.isFeatured && (
                      <Badge variant="default" className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={testimonial.isActive ? "default" : "secondary"}
                    >
                      {testimonial.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Created</span>
                      <span>
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {media && (
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>File Size</span>
                        <span>{formatFileSize(media.size)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
