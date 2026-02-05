import {
  changePasswordInput,
  ChangeTempPassword,
  LoginDTO,
  SignUpDTO,
} from "@/interfaces/auth.interface";
import instance from "@/services/axios";

export const signUpUser = async (data: SignUpDTO) => {
  const res = await instance.post(`/auth/register`, data);
  return res.data;
};

export const loginUser = async (data: LoginDTO) => {
  const res = await instance.post(`/auth/login`, data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await instance.post(`/auth/logout`);
  return res.data;
};

export const getMe = async () => {
  const res = await instance.get(`/auth/me`);
  return res.data;
};

export const changeInitialPassword = async (data: ChangeTempPassword) => {
  const res = await instance.post("/auth/change-initial-admin-password", data);
  return res.data;
};

export const changePassword = async (data: changePasswordInput) => {
  const res = await instance.post("/auth/change-password", data);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await instance.post("/auth/forgot-password", { email });
  return res.data;
};

export const verifyEmail = async (data: { token: string }) => {
  const res = await instance.post("/auth/verify", data);
  return res.data;
};

export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}) => {
  const res = await instance.post("/auth/reset-password", data);
  return res.data;
};
