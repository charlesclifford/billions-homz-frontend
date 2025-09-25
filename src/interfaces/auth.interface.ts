export interface SignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  password: string;
  turnstileToken: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  turnstileToken: string;
}

export interface ChangeTempPassword {
  newPassword: string;
  tempToken: string;
  userId: string;
}

export interface changePasswordInput {
  oldPassword: string;
  newPassword: string;
}
