/* eslint-disable @typescript-eslint/no-explicit-any */

import { SalesFilterInput } from "@/interfaces/sales.interface";
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
    throw new Error(error.response.data.error || "Request failed");
  } else if (error.request) {
    throw new Error("No response received from the server");
  } else {
    throw new Error(error.message || "Request failed");
  }
};

// for admin
export const getAllSales = async (params?: SalesFilterInput) => {
  try {
    const response = await instance.get(`/sales`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// for realtor
export const getMySales = async (params?: SalesFilterInput) => {
  try {
    const response = await instance.get(`/sales/my-sales`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getSalesDetails = async (id: string) => {
  try {
    const response = await instance.get(`/sales/${id}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createSale = async (data: FormData) => {
  try {
    const response = await instance.post("/sales/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
export const updateSale = async (id: string, data: FormData) => {
  try {
    const response = await instance.put(`/sales/${id}/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
export const getSalesAnalytics = async () => {
  try {
    const response = await instance.get(`/sales/analytics`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
