/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const bookInspection = async (data: any) => {
  try {
    const response = await instance.post("/inspections/book", data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const confirmInspection = async (
  id: string,
  data: { confirmedDate: any }
) => {
  try {
    const response = await instance.post(`/inspections/${id}/confirm`, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const cancelInspection = async (
  id: string,
  data: { cancellationReason: string }
) => {
  try {
    const response = await instance.post(`/inspections/${id}/cancel`, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
