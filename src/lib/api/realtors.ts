/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BankDetails,
  SalesPerformanceFilter,
  UplineDetails,
} from "@/interfaces/realtor.interface";
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

export const getRealtorStats = async () => {
  try {
    const response = await instance.get(`/realtors/dashboard-stats`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getRealtorSalesPerformance = async (
  params?: SalesPerformanceFilter
) => {
  try {
    const response = await instance.get(`/realtors/sales-performance`, {
      params,
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateRealtorDetails = async (
  id: string,
  data: { bankDetails: BankDetails; uplineDetails: UplineDetails }
) => {
  try {
    const response = await instance.patch(`/realtors/${id}/details`, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
