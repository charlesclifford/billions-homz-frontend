/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FilterTestimonialsData,
  UpdateTestimonialData,
} from "@/interfaces/testimonial.interface";
import instance from "@/services/axios";

// Handle responses and errors
const handleResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(response.data.message || "Request failed");
};

const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || "Request failed");
  } else if (error.request) {
    throw new Error("No response received from the server");
  } else {
    throw new Error(error.details.message || error.message || "Request failed");
  }
};

/**
 * Get all testimonials (Admin only)
 */
export const getTestimonials = async (params?: FilterTestimonialsData) => {
  try {
    const response = await instance.get("/testimonials", { params });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get featured testimonials (Public)
 */
export const getFeaturedTestimonials = async (limit?: number) => {
  try {
    const response = await instance.get("/testimonials/featured", {
      params: { limit },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get single testimonial by ID
 */
export const getTestimonial = async (id: string) => {
  try {
    const response = await instance.get(`/testimonials/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create new testimonial
 */
export const createTestimonial = async (data: FormData) => {
  try {
    const response = await instance.post("/testimonials/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update testimonial details
 */
export const updateTestimonial = async (
  id: string,
  data: UpdateTestimonialData
) => {
  try {
    const response = await instance.put(`/testimonials/${id}/update`, data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update testimonial media (image/video)
 */
export const updateTestimonialMedia = async (id: string, mediaFile: File) => {
  try {
    const formData = new FormData();
    formData.append("media", mediaFile);

    const response = await instance.put(`/testimonials/${id}/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (id: string) => {
  try {
    const response = await instance.delete(`/testimonials/${id}/delete`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Toggle featured status
 */
export const toggleFeatured = async (id: string) => {
  try {
    const response = await instance.patch(`/testimonials/${id}/featured`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Toggle active status
 */
export const toggleActive = async (id: string) => {
  try {
    const response = await instance.patch(`/testimonials/${id}/active`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
