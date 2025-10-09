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

// =========================
// 📊 Dashboard Stats
// =========================
export interface IDashboardStats {
  estates: {
    total: number;
    available: number;
    availablePercentage: number;
    soldUnits: number;
    soldPercentage: number;
  };
  properties: {
    total: number;
    available: number;
    availablePercentage: number;
    sold: number;
    soldPercentage: number;
  };
  totalRevenue: number;
  pendingCommissionRequests: number;
}

// =========================
// 📈 Sales Performance
// =========================
export interface IDashboardSalesPerformance {
  year: number;
  monthlyData: IMonthlySalesPerformance[];
}

interface IMonthlySalesPerformance {
  month: number; // 1–12
  name: string; // e.g. "Jan", "Feb"
  estates: number; // estate sales count
  properties: number; // property sales count
  totalAmount: number; // ₦ total sales amount
}

// =========================
// 🏆 Top Selling Assets
// =========================
export interface ITopAssetResponse {
  year: number;
  topAssets: ITopAsset[];
}

export interface ITopAsset {
  assetType: "estate" | "property";
  name: string;
  salesCount: number;
  totalAmount: number;
}
