/* eslint-disable @typescript-eslint/no-explicit-any */
import { InviteAdminFormValues } from "@/components/admin/members/UpdateAdmin";
import { CreateAdminInput } from "@/interfaces/admin.interface";
import { SalesPerformanceFilter } from "@/interfaces/realtor.interface";
import { UsersFilterInput } from "@/interfaces/user.interface";
import instance from "@/services/axios";
import { AxiosRequestConfig } from "axios";

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

export const getAllAdmins = async (params?: UsersFilterInput) => {
  const res = await instance.get("/admins", { params });
  return res.data;
};

export const getAdminById = async (id: string) => {
  const res = await instance.get(`/admins/single/${id}`);
  return res.data;
};

export const blockUser = async (id: string, block: boolean) => {
  const res = await instance.post(`/admins/${id}/block`, { block });
  return res.data;
};

export const inviteAdmin = async (data: CreateAdminInput) => {
  const res = await instance.post("/admins/invite", data);
  return res.data;
};

export const updateAdmin = async (id: string, data: InviteAdminFormValues) => {
  const res = await instance.put(`/admins/${id}/update`, data);
  return res.data;
};

export const uploadAdminAvatar = async (
  id: string,
  data: FormData,
  options?: AxiosRequestConfig
) => {
  const res = await instance.patch(`/admins/${id}/avatar`, data, options);
  return res.data;
};

export const getDashboardStats = async () => {
  try {
    const response = await instance.get(`/admins/dashboard-stats`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getSalesPerformance = async (params?: SalesPerformanceFilter) => {
  try {
    const response = await instance.get(`/admins/sales-performance`, {
      params,
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getTopSellingAssets = async (params?: SalesPerformanceFilter) => {
  try {
    const response = await instance.get(`/admins/stats/top-assets`, {
      params,
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// settings
export const getSettings = async () => {
  try {
    const response = await instance.get(`/settings`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateSettings = async (data: {
  commissionPercentage: number;
}) => {
  try {
    const response = await instance.put(`/settings/update`, data);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const promoteToAdmin = async (data: {
  targetId: string;
  targetType: "user" | "realtor";
  permissions: string[];
}) => {
  try {
    const response = await instance.post("/admins/make-admin", data);
    return handleResponse(response);
  } catch (error) {
    console.log("err>>", error);
    handleError(error);
  }
};

export const demoteAdmin = async (data: {
  adminId: string;
  targetType: "user" | "realtor";
}) => {
  try {
    const response = await instance.post("/admins/demote", data);
    return handleResponse(response);
  } catch (error) {
    console.log("err>>", error);
    handleError(error);
  }
};
