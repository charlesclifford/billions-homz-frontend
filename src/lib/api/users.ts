import { IRealtor, RealtorsFilterInput } from "@/interfaces/realtor.interface";
import { IUser, UsersFilterInput } from "@/interfaces/user.interface";
import instance from "@/services/axios";
import { AxiosRequestConfig } from "axios";

export const getAllUsers = async (params?: UsersFilterInput) => {
  const res = await instance.get("/users", { params });
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await instance.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  const res = await instance.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await instance.delete(`/users/${id}`);
  return res.data;
};

export const getAllRealtors = async (params?: RealtorsFilterInput) => {
  const res = await instance.get("/realtors", { params });
  return res.data;
};

export const getRealtorById = async (id: string) => {
  const res = await instance.get(`/realtors/${id}`);
  return res.data;
};

export const updateRealtor = async (id: string, data: Partial<IRealtor>) => {
  const res = await instance.put(`/realtors/${id}/update`, data);
  return res.data;
};

export const uploadUserAvatar = async (
  id: string,
  data: FormData,
  options?: AxiosRequestConfig
) => {
  const res = await instance.patch(`/users/${id}/avatar`, data, options);
  return res.data;
};

export const uploadRealtorAvatar = async (
  id: string,
  data: FormData,
  options?: AxiosRequestConfig
) => {
  const res = await instance.patch(`/realtors/${id}/avatar`, data, options);
  return res.data;
};
