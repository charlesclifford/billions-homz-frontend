/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhotoFormValues } from "@/components/admin/gallery/PhotoUploader";
import { PhotosFilterInput } from "@/interfaces/photos.interface";
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
    throw new Error(error.message || "Request failed");
  }
};

export const getAllPhotos = async (params?: PhotosFilterInput) => {
  try {
    const response = await instance.get(`/photos`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getPhoto = async (id: string) => {
  try {
    const response = await instance.get(`/photos/${id}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createPhoto = async (data: FormData) => {
  try {
    const response = await instance.post("/photos/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updatePhoto = async (id: string, data: PhotoFormValues) => {
  try {
    const response = await instance.put(`/photos/${id}/update`, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deletePhoto = async (id: string) => {
  try {
    const response = await instance.delete(`/photos/${id}/delete`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
