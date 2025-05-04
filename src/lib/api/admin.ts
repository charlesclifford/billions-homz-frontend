import instance from "@/services/axios";

export const blockUser = async (id: string, block: boolean) => {
  const res = await instance.post(`/admins/${id}/block`, { block });
  return res.data;
};
