import { UsersFilterInput } from "@/interfaces/user.interface";
import instance from "@/services/axios";

export const getAllUsers = async (params?: UsersFilterInput) => {
  const res = await instance.get("/users", { params });
  return res.data;
};
