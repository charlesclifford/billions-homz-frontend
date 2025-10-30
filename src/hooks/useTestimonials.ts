import {
  FilterTestimonialsData,
  TestimonialsResponse,
} from "@/interfaces/testimonial.interface";
import {
  getFeaturedTestimonials,
  getTestimonial,
  getTestimonials,
} from "@/lib/api/testimonials";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Query keys
export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (filters: FilterTestimonialsData) =>
    [...testimonialKeys.lists(), filters] as const,
  details: () => [...testimonialKeys.all, "detail"] as const,
  detail: (id: string) => [...testimonialKeys.details(), id] as const,
  featured: () => [...testimonialKeys.all, "featured"] as const,
};

// Queries
export const useTestimonials = (params?: FilterTestimonialsData) => {
  const { data, isLoading, error, refetch } = useQuery<TestimonialsResponse>({
    queryKey: testimonialKeys.list(params!),
    queryFn: () => getTestimonials(params),
  });

  const { testimonials, total, totalPages } = useMemo(() => {
    if (!data || isLoading || error)
      return { testimonials: [], total: 0, totalPages: 0 };

    return {
      testimonials: data.data || [],
      total: data.pagination?.total || 0,
      totalPages: data.pagination?.totalPages || 0,
    };
  }, [data, isLoading, error]);

  return { testimonials, total, totalPages, isLoading, error, refetch };
};

export const useFeaturedTestimonials = (limit?: number) => {
  return useQuery({
    queryKey: testimonialKeys.featured(),
    queryFn: () => getFeaturedTestimonials(limit),
  });
};

export const useTestimonial = (id: string) => {
  return useQuery({
    queryKey: testimonialKeys.detail(id),
    queryFn: () => getTestimonial(id),
    enabled: !!id,
  });
};
