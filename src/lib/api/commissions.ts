/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommissionsFilterInput } from "@/interfaces/commission.interface";
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
export const getAllCommissions = async (params?: CommissionsFilterInput) => {
  try {
    const response = await instance.get(`/commissions`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// for realtors
export const getRealtorCommissions = async (
  params?: CommissionsFilterInput
) => {
  try {
    const response = await instance.get(`/commissions/my-commissions`, {
      params,
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const requestPayout = async (id: string) => {
  try {
    const response = await instance.patch(`/commissions/${id}/request`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const approvePayout = async (id: string) => {
  try {
    const response = await instance.patch(`/commissions/${id}/approve`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const processPayout = async (id: string) => {
  try {
    const response = await instance.patch(`/commissions/${id}/pay`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
