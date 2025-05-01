import { LoginFormData } from "@/app/(auth)/components/SignInForm";
import { SignUpFormData } from "@/app/(auth)/components/SignUpForm";
import instance from "@/services/axios";

export const signUpUser = async (data: SignUpFormData) => {
  const res = await instance.post(`/auth/sign-up`, data);
  return res.data;
};

export const loginUser = async (data: LoginFormData) => {
  const res = await instance.post(`/auth/login`, data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await instance.post(`/auth/logout`);
  return res.data;
};
