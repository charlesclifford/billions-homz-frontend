/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyFormData } from "@/app/(dashboard)/components/properties/PropertyDetailsForm";
import {
  DeleteImageParams,
  DeleteImagesParams,
  PropertyFilterInput,
} from "@/interfaces/property.interface";
import instance from "@/services/axios";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

// Handle responses and errors
const handleResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(response.data.message || "Request failed");
};

const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.error || "Request failed");
  } else if (error.request) {
    throw new Error("No response received from the server");
  } else {
    throw new Error(error.message || "Request failed");
  }
};

export const getAllProperties = async (params?: PropertyFilterInput) => {
  try {
    const response = await axios.get(`${baseUrl}/properties`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const response = await instance.get(`/properties/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getPropertyBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${baseUrl}/properties/single/${slug}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createProperty = async (data: PropertyFormData) => {
  try {
    const response = await instance.post("/properties/create", data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateProperty = async (id: string, data: PropertyFormData) => {
  try {
    const response = await instance.patch(`/properties/update/${id}`, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const response = await instance.delete(`/properties/delete/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteImage = async (params: DeleteImageParams) => {
  try {
    const response = await instance.delete("/image/delete", { params });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteImages = async (params: DeleteImagesParams) => {
  try {
    const response = await instance.post("/image/delete-images", params);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const publishProperty = async (id: string) => {
  try {
    const response = await instance.patch(`/properties/${id}/publish`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
