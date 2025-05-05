import { CreateAdminInput } from "@/interfaces/admin.interface";
import { UsersFilterInput } from "@/interfaces/user.interface";
import instance from "@/services/axios";

export const getAllAdmins = async (params?: UsersFilterInput) => {
  const res = await instance.get("/admins", { params });
  return res.data;
};

// export const getAdminById = async (id: string) => {
//   const res = await instance.get(`/admins/${id}`);
//   return res.data;
// };

export const blockUser = async (id: string, block: boolean) => {
  const res = await instance.post(`/admins/${id}/block`, { block });
  return res.data;
};

export const inviteAdmin = async (data: CreateAdminInput) => {
  const res = await instance.post("/admins/invite", data);
  return res.data;
};


