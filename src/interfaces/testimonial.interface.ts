export interface ITestimonial {
  _id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  media: TestimonialMedia;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialMedia {
  type: "image" | "video";
  publicId: string;
  url: string;
  thumbnailUrl?: string; // For videos
  duration?: number; // For videos
  format: string;
  size: number;
}

export interface CreateTestimonialData {
  name: string;
  position: string;
  company?: string;
  content: string;
  isFeatured?: boolean;
  media: File;
}

export interface UpdateTestimonialData {
  name?: string;
  position?: string;
  company?: string;
  content?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface TestimonialsResponse {
  success: boolean;
  data: ITestimonial[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TestimonialResponse {
  success: boolean;
  data: ITestimonial;
}

export interface FilterTestimonialsData {
  featured?: boolean;
  active?: boolean;
  page?: number;
  limit?: number;
}