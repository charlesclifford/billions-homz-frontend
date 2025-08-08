import { IProperty } from "./property.interface";
import { IImage } from "./user.interface";

export interface IRealtor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: IImage;
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

export interface IRealtorStats {
  totalSales: number;
  salesGrowth: number;
  pendingCommissions: number;
  pendingRequests: number;
  approvedCommissions: number;
  approvedRequests: number;
  totalEarnings: number;
  earningsGrowth: number;
  salesChartData: {
    month: string;
    sales: number;
    commissions: number;
  }[];
  recentSales: {
    id: string;
    estate: string;
    buyer: string;
    amount: number;
    date: string;
  }[];
}
