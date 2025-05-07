export interface ChangeTempPassword {
  newPassword: string;
  tempToken: string;
  userId: string;
}
