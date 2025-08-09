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
}
