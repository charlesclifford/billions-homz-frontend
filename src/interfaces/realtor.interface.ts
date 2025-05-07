import { IProperty } from "./property.interface";

export interface IRealtor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  licenseNumber: string;
  bio?: string;
  experienceYears: number;
  personalCode: string;
  propertiesSold: [];
  totalEarnings: number;
  pendingCommissions: number;
  paidCommissions: number;
  commissionPayments: ICommissionPayment[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: Date;
}

interface ICommissionPayment {
  amount: number;
  paymentDate: Date;
  property: IProperty;
  // recordedBy: IAdmin
  note: string;
}

export interface RealtorsFilterInput {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}
