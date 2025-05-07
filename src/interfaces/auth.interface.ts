export interface ChangeTempPassword {
  newPassword: string;
  tempToken: string;
  userId: string;
}

export interface changePasswordInput {
  oldPassword: string;
  newPassword: string;
}