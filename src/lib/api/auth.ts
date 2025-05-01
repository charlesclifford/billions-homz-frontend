import { SignUpFormData } from "@/app/(auth)/components/SignUpForm";
import { LoginFormValues } from "@/components/auth/LoginForm";
import instance from "@/services/axios";

export const signUpUser = async (data: SignUpFormData) => {
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
