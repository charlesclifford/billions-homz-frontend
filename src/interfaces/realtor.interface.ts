import { IImage, UserRole } from "./user.interface";

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
  gender: "male" | "female";

  isVerified: boolean;
  isBlocked: boolean;
  isFirstLogin: boolean;
  role?: UserRole;

  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: Date;

  bankDetails?: BankDetails;
  uplineDetails?: UplineDetails;
  isProfileComplete: boolean;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface UplineDetails extends BankDetails {
  uplineName: string;
  uplinePhone: string;
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
  includeDeleted?: boolean;
  includeWithoutAuth?: boolean;
}

export interface IRealtorStats {
  availablePropertiesCount: number;
  pendingCommissions: number;
  soldPropertiesCount: number;
  totalEarnings: number;
}

export interface IRealtorSalesPerformance {
  year: number; // The year this data represents
  monthlyData: MonthlySalesData[]; // Array of monthly data
  topEstates: TopEstate[];
}

interface MonthlySalesData {
  month: number; // 1-12 representing January-December
  name: string; // Short month name (e.g., "Jan", "Feb")
  salesCount: number; // Number of sales in this month
  salesAmount: number; // Total sales amount in this month
}

interface TopEstate {
  estateName: string; // Name of the estate
  estateId: string; // MongoDB ID of the estate
  count: number; // Number of sales for this estate
  totalAmount: number; // Total sales amount for this estate
}

export interface SalesPerformanceFilter {
  year: number;
  type?: string;
}
