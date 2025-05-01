import { IUser } from "./user.interface";

export type PartnershipLevel = "basic" | "premium" | "elite";

export interface IRealtor extends IUser {
  licenseNumber: string;
  bio?: string;
  experienceYears: number;
  partnershipLevel: PartnershipLevel;
  personalCode: string;
  referralLink: string;
  propertiesListed: [];
  commissionRate: number;
  totalEarnings: number;
  pendingCommissions: number;
}
