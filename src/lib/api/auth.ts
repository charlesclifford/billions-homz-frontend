import { LoginFormValues } from "@/components/auth/LoginForm";
import { RegisterFormValues } from "@/components/auth/RegisterForm";
import { ChangeTempPassword } from "@/interfaces/auth.interface";
import instance from "@/services/axios";

export const signUpUser = async (data: RegisterFormValues) => {
  const res = await instance.post(`/auth/register`, data);
  return res.data;
};

export const loginUser = async (data: LoginFormValues) => {
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
