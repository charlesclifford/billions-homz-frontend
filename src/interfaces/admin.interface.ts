import { IImage } from "./user.interface";

export type AdminPermission =
  | "manage_users"
  | "manage_properties"
  | "manage_content"
  | "manage_settings"
  | "view_analytics"
  | "manage_admins";

export interface CreateAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "super_admin";
  permissions?: string[];
}

export interface IAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: IImage;
  permissions: AdminPermission[];
  isSuperAdmin?: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  propertiesListed: [];
  createdAt: string;
  updatedAt: string;
  lastLogin?: Date;
  isBlocked: boolean;
  isActive: boolean;
  isVerified: boolean;
  role: "admin" | "super_admin";
}

export interface IDashboardStats {
  totalProperties: number;
  available: number;
  availablePercentage: number;
  sold: {
    total: number;
    percentage: number;
  };
  totalRevenue: number;
  requested: number;
}

export interface IDashboardSalesPerformance {
  year: number;
  monthlyData: MonthlyData[];
}

interface MonthlyData {
  month: number;
  name: string;
  salesCount: number;
  salesAmount: number;
}

export interface ITopEstateResponse {
  year: number;
  topEstates: ITopEstate[];
}

export interface ITopEstate {
  salesCount: number;
  totalAmount: number;
  estateId: string;
  estateName: string;
}
