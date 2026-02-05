"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTestimonials } from "@/hooks/useTestimonials";
import {
  ITestimonial,
  TestimonialMedia,
} from "@/interfaces/testimonial.interface";
import { useState } from "react";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialsSkeleton } from "./TestimonialsSkeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/features/testimonials/testimonial.slice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/components/shared/DataTable";
import Link from "next/link";

const TestimonialsContent = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.testimonial);
  const { testimonials, isLoading, error, totalPages, total } =
    useTestimonials(filter);
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    media: TestimonialMedia | null;
    testimonial: ITestimonial | null;
  }>({
    open: false,
    media: null,
    testimonial: null,
  });

  const openPreview = (testimonial: ITestimonial) => {
    setPreviewModal({
      open: true,
      media: testimonial.media,
      testimonial: testimonial,
    });
  };

  const closePreview = () => {
    setPreviewModal({
      open: false,
      media: null,
      testimonial: null,
    });
  };

  const onPaginationChange = (page: number) => {
    dispatch(setFilter({ page }));
  };

  // Calculate the range of items being shown
  const startItem = (filter.page - 1) * filter.limit + 1;
  const endItem = Math.min(filter.page * filter.limit, total);

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">
              Error loading testimonials: {error.message}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No testimonials found.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/testimonials/new">
                Create First Testimonial
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground font-medium text-sm">
            Showing{" "}
            <span className=" text-primary">
              {startItem} - {endItem} of {total}
            </span>{" "}
            testimonial
            {testimonials.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial._id}
              testimonial={testimonial}
              onPreview={openPreview}
            />
          ))}
        </div>

        {/* Pagination controls */}
        {testimonials.length > 0 && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPaginationChange(filter.page - 1)}
                  aria-disabled={filter.page === 1}
                  className={cn(
                    "cursor-pointer",
                    filter.page === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {getPaginationRange(filter.page, totalPages).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === filter.page}
                    onClick={() => onPaginationChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPaginationChange(filter.page + 1)}
                  aria-disabled={filter.page >= totalPages}
                  className={cn(
                    "cursor-pointer",
                    filter.page >= totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Preview Modal */}
      <MediaPreviewModal
        open={previewModal.open}
        onClose={closePreview}
        media={previewModal.media}
        testimonial={previewModal.testimonial}
      />
    </>
  );
};

// Media Preview Modal Component

export default TestimonialsContent;
